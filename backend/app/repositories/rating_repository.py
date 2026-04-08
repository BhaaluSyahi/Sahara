from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.entities import Rating
from app.models.schemas import RatingCreate
from uuid import UUID


class RatingRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, from_user_id: UUID, data: RatingCreate) -> Rating:
        db_rating = Rating(
            from_user_id=from_user_id,
            **data.model_dump()
        )
        self.db.add(db_rating)
        await self.db.commit()
        await self.db.refresh(db_rating)
        return db_rating
    
    async def get_by_id(self, rating_id: UUID) -> Rating | None:
        result = await self.db.execute(
            select(Rating).where(Rating.id == rating_id)
        )
        return result.scalars().first()
    
    async def get_target_ratings(self, target_type: str, target_id: UUID) -> list[Rating]:
        result = await self.db.execute(
            select(Rating).where(
                (Rating.target_type == target_type) & 
                (Rating.target_id == target_id)
            )
        )
        return result.scalars().all()
    
    async def get_average_rating(self, target_type: str, target_id: UUID) -> float | None:
        ratings = await self.get_target_ratings(target_type, target_id)
        if not ratings:
            return None
        return sum(r.rating for r in ratings) / len(ratings)
