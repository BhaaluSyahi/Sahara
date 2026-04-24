from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import Optional

from app.db.base import get_db
from app.core.security import get_current_user
from app.models.schemas import (
    RequestCreate, RequestUpdate, RequestResponse, ParticipantResponse,
)
from app.repositories.request_repository import RequestRepository, RequestParticipantRepository
from app.repositories.volunteer_repository import VolunteerRepository
from app.services.ai_service import RequestResearchService
from app.services.queue_service import queue_service

router = APIRouter(prefix="/api/v1/requests", tags=["requests"])


@router.post("/", response_model=RequestResponse)
async def create_request(
    request_data: RequestCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new request (volunteer or organization)"""
    request_repo = RequestRepository(db)
    
    user_id = UUID(current_user["user_id"])
    
    # Determine issuer type based on user role
    issuer_type = "volunteer" if current_user.get("role") == "volunteer" else "organization"
    
    req = await request_repo.create(issuer_type, user_id, request_data)
    
    # Extract category from request data
    category = request_data.category
    
    # Publish to SQS queue
    queue_result = await queue_service.publish_request(
        str(req.id), 
        category, 
        {
            "title": req.title,
            "description": req.description,
            "location_type": req.location_type,
            "issuer_type": issuer_type,
            "issuer_id": str(user_id)
        }
    )
    
    # Update request with queue status
    if queue_result["status"] == "success":
        await request_repo.update_progress(
            req.id, 
            0, 
            agent_status="queued"
        )
    else:
        await request_repo.update_progress(
            req.id, 
            0, 
            agent_status="failed"
        )
    
    return req


@router.get("/my", response_model=list[RequestResponse])
async def get_my_requests(
    status: Optional[str] = Query(None, description="Filter by status: open, closed, deleted"),
    title: Optional[str] = Query(None, description="Search by title (partial match)"),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all requests issued by the current user, with optional filters"""
    request_repo = RequestRepository(db)

    issuer_type = "volunteer" if current_user.get("role") == "volunteer" else "organization"
    user_id = UUID(current_user["user_id"])

    return await request_repo.list_by_issuer(issuer_type, user_id, status=status, title=title)


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


@router.post("/{request_id}/join", response_model=ParticipantResponse)
async def join_request(
    request_id: UUID,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Join a request (volunteer only)"""
    participant_repo = RequestParticipantRepository(db)
    request_repo = RequestRepository(db)
    volunteer_repo = VolunteerRepository(db)
    
    req = await request_repo.get_by_id(request_id)
    if not req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
    
    if req.status not in ["open"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Request is not open for joining"
        )
    
    # Get volunteer profile for current user
    user_id = UUID(current_user["user_id"])
    volunteer_profile = await volunteer_repo.get_by_user_id(user_id)
    if not volunteer_profile:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Volunteer profile required. Please create a volunteer profile first."
        )
    
    participant = await participant_repo.create(request_id, volunteer_profile.user_id, role="participant")
    return participant


@router.post("/{request_id}/retry", response_model=RequestResponse)
async def retry_failed_request(
    request_id: UUID,
    retry_data: dict = Body(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retry a failed request with new category"""
    request_repo = RequestRepository(db)
    
    # Get the request
    req = await request_repo.get_by_id(request_id)
    if not req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
    
    # Check if user owns the request
    user_id = UUID(current_user["user_id"])
    issuer_type = "volunteer" if current_user.get("role") == "volunteer" else "organization"
    
    if req.issuer_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only retry your own requests"
        )
    
    # Check if request is failed
    if req.agent_research_status != "failed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only failed requests can be retried"
        )
    
    # Extract category from request body
    category = retry_data.get("category")
    
    # Publish to SQS queue with new category
    queue_result = await queue_service.publish_request(
        str(req.id), 
        category, 
        {
            "title": req.title,
            "description": req.description,
            "location_type": req.location_type,
            "issuer_type": req.issuer_type,
            "issuer_id": str(req.issuer_id)
        }
    )
    
    # Update request with queue status
    if queue_result["status"] == "success":
        await request_repo.update_progress(
            req.id, 
            0, 
            agent_status="queued"
        )
    else:
        await request_repo.update_progress(
            req.id, 
            0, 
            agent_status="failed"
        )
    
    return req


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
