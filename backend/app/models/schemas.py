from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from uuid import UUID


# Auth Schemas
class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    role: str  # employee, volunteer


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Volunteer Schemas
class VolunteerProfileCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    specialty: Optional[str] = None
    bio: Optional[str] = None


class VolunteerProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    specialty: Optional[str] = None
    bio: Optional[str] = None


class VolunteerProfileResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    phone: Optional[str]
    latitude: Optional[str]
    longitude: Optional[str]
    specialty: Optional[str]
    bio: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Organization Schemas
class OrganizationCreate(BaseModel):
    name: str
    type: str
    description: Optional[str] = None


class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None


class OrganizationResponse(BaseModel):
    id: UUID
    name: str
    type: str
    description: Optional[str]
    verified: bool
    status: str
    created_by: UUID
    created_at: datetime

    class Config:
        from_attributes = True


# Organization Document Schemas
class DocumentUploadResponse(BaseModel):
    id: UUID
    organization_id: UUID
    filename: str
    storage_path: str
    agent_status: str
    created_at: datetime

    class Config:
        from_attributes = True


# Organization Membership Schemas
class MembershipCreate(BaseModel):
    volunteer_id: UUID
    role: str = "member"  # admin, subadmin, member


class MembershipResponse(BaseModel):
    id: UUID
    organization_id: UUID
    volunteer_id: UUID
    role: str
    joined_at: datetime

    class Config:
        from_attributes = True


# Request Schemas
class RequestCreate(BaseModel):
    title: str
    description: str
    location_type: str  # online, location
    location_text: Optional[str] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None


class RequestUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class RequestResponse(BaseModel):
    id: UUID
    title: str
    description: str
    location_type: str
    location_text: Optional[str]
    status: str
    progress_percent: int
    recommendations: Optional[dict]
    infoboard: Optional[dict]
    agent_research_status: str
    created_at: datetime

    class Config:
        from_attributes = True


# Request Participant Schemas
class ParticipantCreate(BaseModel):
    volunteer_id: UUID
    role: str = "participant"


class ParticipantResponse(BaseModel):
    id: UUID
    request_id: UUID
    volunteer_id: UUID
    role: str
    credit_percent: int
    joined_at: datetime

    class Config:
        from_attributes = True


# Rating Schemas
class RatingCreate(BaseModel):
    target_type: str  # organization, volunteer
    target_id: UUID
    rating: int  # 1-5
    comment: Optional[str] = None


class RatingResponse(BaseModel):
    id: UUID
    from_user_id: UUID
    target_type: str
    target_id: UUID
    rating: int
    comment: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
