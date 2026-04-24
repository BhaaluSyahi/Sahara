from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from jose import jwt
import os
from datetime import datetime, timedelta

from app.db.base import get_db
from app.core.security import get_current_user
from app.core.config import settings

router = APIRouter(prefix="/api/v1/realtime", tags=["realtime"])


@router.post("/token")
async def get_realtime_token(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate a Supabase realtime token for accessing the requests table
    with Row Level Security (RLS) restrictions
    """
    try:
        # Create a token specifically for Supabase realtime
        # This token will have limited permissions and only access requests table
        payload = {
            "sub": str(current_user["user_id"]),
            "role": current_user.get("role"),
            "realtime": True,
            "tables": ["requests"],  # Only allow access to requests table
            "permissions": {
                "requests": ["read", "listen"]  # Read and listen to changes
            },
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + timedelta(hours=1),  # 1 hour expiry
            "iss": "sahara-backend"
        }
        
        # Sign with Supabase key (you should use your Supabase JWT secret)
        realtime_token = jwt.encode(
            payload,
            settings.supabase_key,  # This should be your Supabase JWT secret
            algorithm="HS256"
        )
        
        return {
            "token": realtime_token,
            "expires_at": payload["exp"].isoformat(),
            "permissions": payload["permissions"],
            "tables": payload["tables"]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate realtime token: {str(e)}"
        )


@router.get("/status")
async def get_realtime_status(
    current_user: dict = Depends(get_current_user)
):
    """Get realtime connection status and info"""
    return {
        "status": "active",
        "user_id": current_user["user_id"],
        "role": current_user.get("role"),
        "supported_tables": ["requests"],
        "features": {
            "live_updates": True,
            "real_time_triggers": True,
            "row_level_security": True
        }
    }
