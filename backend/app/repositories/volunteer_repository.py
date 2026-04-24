from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.entities import VolunteerProfile
from app.models.schemas import VolunteerProfileCreate, VolunteerProfileUpdate
from uuid import UUID


class VolunteerRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, user_id: UUID, data: VolunteerProfileCreate) -> VolunteerProfile:
        db_profile = VolunteerProfile(
            user_id=user_id,
            **data.model_dump()
        )
        self.db.add(db_profile)
        await self.db.commit()
        await self.db.refresh(db_profile)
        return db_profile
    
    async def get_by_user_id(self, user_id: UUID) -> VolunteerProfile | None:
        result = await self.db.execute(
            select(VolunteerProfile).where(VolunteerProfile.user_id == user_id)
        )
        return result.scalars().first()
    
    async def update(self, user_id: UUID, data: VolunteerProfileUpdate) -> VolunteerProfile | None:
        profile = await self.get_by_user_id(user_id)
        if not profile:
            return None
        
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(profile, key, value)
        
        await self.db.commit()
        await self.db.refresh(profile)
        return profile
