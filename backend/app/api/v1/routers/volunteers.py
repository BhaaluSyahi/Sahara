from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.db.base import get_db
from app.core.security import get_current_user, get_volunteer_user
from app.models.schemas import VolunteerProfileCreate, VolunteerProfileUpdate, VolunteerProfileResponse
from app.repositories.volunteer_repository import VolunteerRepository

router = APIRouter(prefix="/api/v1/volunteers", tags=["volunteers"])


@router.post("/profile", response_model=VolunteerProfileResponse)
async def create_volunteer_profile(
    profile_data: VolunteerProfileCreate,
    current_user: dict = Depends(get_volunteer_user),
    db: AsyncSession = Depends(get_db)
):
    """Create or update volunteer profile"""
    volunteer_repo = VolunteerRepository(db)
    user_id = UUID(current_user["user_id"])
    
    # Check if profile exists
    existing = await volunteer_repo.get_by_user_id(user_id)
    if existing:
        profile = await volunteer_repo.update(existing.id, VolunteerProfileUpdate(**profile_data.model_dump()))
        return profile
    
    profile = await volunteer_repo.create(user_id, profile_data)
    return profile


@router.get("/profile", response_model=VolunteerProfileResponse)
async def get_volunteer_profile(
    current_user: dict = Depends(get_volunteer_user),
    db: AsyncSession = Depends(get_db)
):
    """Get volunteer profile"""
    volunteer_repo = VolunteerRepository(db)
    user_id = UUID(current_user["user_id"])
    
    profile = await volunteer_repo.get_by_user_id(user_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Volunteer profile not found"
        )
    
    return profile


@router.put("/profile", response_model=VolunteerProfileResponse)
async def update_volunteer_profile(
    profile_data: VolunteerProfileUpdate,
    current_user: dict = Depends(get_volunteer_user),
    db: AsyncSession = Depends(get_db)
):
    """Update volunteer profile"""
    volunteer_repo = VolunteerRepository(db)
    user_id = UUID(current_user["user_id"])
    
    profile = await volunteer_repo.get_by_user_id(user_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Volunteer profile not found"
        )
    
    updated = await volunteer_repo.update(profile.id, profile_data)
    return updated
