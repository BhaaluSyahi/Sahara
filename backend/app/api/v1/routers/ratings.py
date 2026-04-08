from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.db.base import get_db
from app.core.security import get_current_user
from app.models.schemas import RatingCreate, RatingResponse
from app.repositories.rating_repository import RatingRepository

router = APIRouter(prefix="/api/v1/ratings", tags=["ratings"])


@router.post("/", response_model=RatingResponse)
async def create_rating(
    rating_data: RatingCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a rating (bidirectional: volunteer rates org or org rates volunteer)"""
    rating_repo = RatingRepository(db)
    
    from_user_id = UUID(current_user["user_id"])
    
    rating = await rating_repo.create(from_user_id, rating_data)
    return rating


@router.get("/{target_type}/{target_id}")
async def get_target_ratings(
    target_type: str,
    target_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get all ratings for a target (organization or volunteer)"""
    rating_repo = RatingRepository(db)
    
    if target_type not in ["organization", "volunteer"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid target type"
        )
    
    ratings = await rating_repo.get_target_ratings(target_type, target_id)
    avg_rating = await rating_repo.get_average_rating(target_type, target_id)
    
    return {
        "ratings": ratings,
        "average_rating": avg_rating,
        "count": len(ratings)
    }
