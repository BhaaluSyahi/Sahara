from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta

from app.db.base import get_db
from app.models.schemas import UserRegisterRequest, UserLoginRequest, TokenResponse
from app.repositories.user_repository import UserRepository
from app.repositories.volunteer_repository import VolunteerRepository
from app.core.security import create_access_token
from app.core.config import settings

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
async def register(request: UserRegisterRequest, db: AsyncSession = Depends(get_db)):
    """Register a new user (employee or volunteer)"""
    user_repo = UserRepository(db)
    
    # Check if user exists
    existing = await user_repo.get_by_email(request.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user = await user_repo.create(request.email, request.password, request.role)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes)
    )
    
    return TokenResponse(access_token=access_token)


@router.post("/login", response_model=TokenResponse)
async def login(request: UserLoginRequest, db: AsyncSession = Depends(get_db)):
    """Login user"""
    user_repo = UserRepository(db)
    
    # Authenticate user
    user = await user_repo.authenticate(request.email, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes)
    )
    
    return TokenResponse(access_token=access_token)
