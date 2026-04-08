from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.entities import User
from app.core.security import hash_password, verify_password
from uuid import UUID


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, email: str, password: str, role: str) -> User:
        db_user = User(
            email=email,
            password_hash=hash_password(password),
            role=role,
        )
        self.db.add(db_user)
        await self.db.commit()
        await self.db.refresh(db_user)
        return db_user
    
    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalars().first()
    
    async def get_by_id(self, user_id: UUID) -> User | None:
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalars().first()
    
    async def authenticate(self, email: str, password: str) -> User | None:
        user = await self.get_by_email(email)
        if not user or not verify_password(password, user.password_hash):
            return None
        return user
