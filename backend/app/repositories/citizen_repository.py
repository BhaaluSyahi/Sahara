from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.entities import CitizenProfile
from app.models.schemas import CitizenProfileCreate, CitizenProfileUpdate
from uuid import UUID


class CitizenRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, user_id: UUID, data: CitizenProfileCreate) -> CitizenProfile:
        profile = CitizenProfile(user_id=user_id, **data.model_dump())
        self.db.add(profile)
        await self.db.commit()
        await self.db.refresh(profile)
        return profile

    async def get_by_user_id(self, user_id: UUID) -> CitizenProfile | None:
        result = await self.db.execute(
            select(CitizenProfile).where(CitizenProfile.user_id == user_id)
        )
        return result.scalars().first()

    async def update(self, user_id: UUID, data: CitizenProfileUpdate) -> CitizenProfile | None:
        profile = await self.get_by_user_id(user_id)
        if not profile:
            return None
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(profile, key, value)
        await self.db.commit()
        await self.db.refresh(profile)
        return profile
