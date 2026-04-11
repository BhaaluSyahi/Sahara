from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Query
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import Optional

from app.db.base import get_db
from app.core.security import get_current_user
from app.models.schemas import RequestCreate, RequestUpdate, RequestResponse, ParticipantResponse
from app.repositories.request_repository import RequestRepository, RequestParticipantRepository
from app.services.ai_service import RequestResearchService

router = APIRouter(prefix="/api/v1/requests", tags=["requests"])


@router.post("/", response_model=RequestResponse)
async def create_request(
    request_data: RequestCreate,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new request (volunteer or organization)"""
    request_repo = RequestRepository(db)
    
    user_id = UUID(current_user["user_id"])
    
    # Determine issuer type based on user role
    issuer_type = "volunteer" if current_user.get("role") == "volunteer" else "organization"
    
    req = await request_repo.create(issuer_type, user_id, request_data)
    
    # Start async research in background
    background_tasks.add_task(research_request, req.id, db)
    
    return req


@router.get("/{request_id}", response_model=RequestResponse)
async def get_request(
    request_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get request details"""
    request_repo = RequestRepository(db)
    
    req = await request_repo.get_by_id(request_id)
    if not req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
    
    return req


@router.put("/{request_id}", response_model=RequestResponse)
async def update_request(
    request_id: UUID,
    request_data: RequestUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update request (creator only)"""
    request_repo = RequestRepository(db)
    
    req = await request_repo.get_by_id(request_id)
    if not req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
    
    # Verify ownership
    if str(req.issuer_id) != current_user["user_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only request creator can update"
        )
    
    updated = await request_repo.update(request_id, request_data)
    return updated


@router.delete("/{request_id}")
async def delete_request(
    request_id: UUID,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete (mark as deleted) request"""
    request_repo = RequestRepository(db)
    
    req = await request_repo.get_by_id(request_id)
    if not req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
    
    if str(req.issuer_id) != current_user["user_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only request creator can delete"
        )
    
    await request_repo.update(request_id, RequestUpdate(status="deleted"))
    return {"status": "deleted"}


@router.get("/my", response_model=list[RequestResponse])
async def get_my_requests(
    status: Optional[str] = Query(None, description="Filter by status: open, in_progress, done, resolved, closed"),
    title: Optional[str] = Query(None, description="Search by title (partial match)"),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all requests issued by the current user, with optional filters"""
    request_repo = RequestRepository(db)

    issuer_type = "volunteer" if current_user.get("role") == "volunteer" else "organization"
    user_id = UUID(current_user["user_id"])

    return await request_repo.list_by_issuer(issuer_type, user_id, status=status, title=title)


@router.post("/{request_id}/join", response_model=ParticipantResponse)
async def join_request(
    request_id: UUID,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Join a request (volunteer only)"""
    participant_repo = RequestParticipantRepository(db)
    request_repo = RequestRepository(db)
    
    req = await request_repo.get_by_id(request_id)
    if not req or req.status != "open":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found or not open"
        )
    
    # For now, assume current_user has a volunteer profile
    # In production, retrieve volunteer_id from DB
    volunteer_id = UUID("00000000-0000-0000-0000-000000000001")  # Placeholder
    
    participant = await participant_repo.create(request_id, volunteer_id, role="participant")
    return participant


@router.get("/{request_id}/participants", response_model=list[ParticipantResponse])
async def get_request_participants(
    request_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get all participants for a request"""
    participant_repo = RequestParticipantRepository(db)
    
    participants = await participant_repo.get_request_participants(request_id)
    return participants


async def research_request(request_id: UUID, db: AsyncSession):
    """Background task to research request using AI agent"""
    request_repo = RequestRepository(db)
    
    # Start research
    await request_repo.update_progress(request_id, 0, agent_status="in_progress")
    
    # Call research service
    result = await RequestResearchService.research_request(str(request_id), {})
    
    if result["status"] == "success":
        await request_repo.update_progress(
            request_id,
            result["progress"],
            recommendations=result["recommendations"],
            infoboard=result["infoboard"],
            agent_status="complete"
        )
