from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.db.base import get_db
from app.core.security import get_current_user
from app.models.schemas import (
    OrganizationCreate, OrganizationUpdate, OrganizationResponse,
    MembershipCreate, MembershipResponse, DocumentUploadResponse
)
from app.repositories.organization_repository import (
    OrganizationRepository, OrganizationMembershipRepository, OrganizationDocumentRepository
)
from app.repositories.volunteer_repository import VolunteerRepository
from app.services.storage_service import upload_file_to_s3

router = APIRouter(prefix="/api/v1/organizations", tags=["organizations"])


@router.post("/", response_model=OrganizationResponse)
async def create_organization(
    org_data: OrganizationCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new organization (employee only)"""
    if current_user.get("role") != "employee":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employees can create organizations"
        )
    
    org_repo = OrganizationRepository(db)
    created_by = UUID(current_user["user_id"])
    
    org = await org_repo.create(created_by, org_data)
    return org


@router.get("/{org_id}", response_model=OrganizationResponse)
async def get_organization(
    org_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get organization details"""
    org_repo = OrganizationRepository(db)
    
    org = await org_repo.get_by_id(org_id)
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    return org


@router.put("/{org_id}", response_model=OrganizationResponse)
async def update_organization(
    org_id: UUID,
    org_data: OrganizationUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update organization (employee/admin only)"""
    org_repo = OrganizationRepository(db)
    
    org = await org_repo.get_by_id(org_id)
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Only creator or admin can update
    if str(org.created_by) != current_user["user_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only organization creator can update"
        )
    
    updated = await org_repo.update(org_id, org_data)
    return updated


@router.post("/{org_id}/documents", response_model=DocumentUploadResponse)
async def upload_organization_document(
    org_id: UUID,
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Upload document for organization"""
    org_repo = OrganizationRepository(db)
    doc_repo = OrganizationDocumentRepository(db)
    
    org = await org_repo.get_by_id(org_id)
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    uploaded_by = UUID(current_user["user_id"])

    # Upload file to S3
    file_bytes = await file.read()
    s3_key = f"orgs/{org_id}/documents/{file.filename}"
    try:
        storage_path = await upload_file_to_s3(file_bytes, s3_key, content_type=file.content_type or "application/octet-stream")
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))

    doc = await doc_repo.create(org_id, uploaded_by, file.filename, storage_path)
    return doc


@router.post("/{org_id}/members", response_model=MembershipResponse)
async def add_organization_member(
    org_id: UUID,
    membership_data: MembershipCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Add volunteer to organization (admin/subadmin only)"""
    org_repo = OrganizationRepository(db)
    member_repo = OrganizationMembershipRepository(db)
    volunteer_repo = VolunteerRepository(db)
    
    org = await org_repo.get_by_id(org_id)
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Check if current user is admin/subadmin in org
    current_user_id = UUID(current_user["user_id"])
    members = await member_repo.get_org_members(org_id)
    current_membership = next((m for m in members if m.added_by == current_user_id), None)
    
    if not current_membership or current_membership.role not in ["admin", "subadmin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins or subadmins can add members"
        )
    
    # Verify volunteer exists
    volunteer = await volunteer_repo.get_by_id(membership_data.volunteer_id)
    if not volunteer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Volunteer not found"
        )
    
    membership = await member_repo.create(
        org_id,
        membership_data.volunteer_id,
        current_user_id,
        membership_data.role
    )
    return membership


@router.get("/{org_id}/members", response_model=list[MembershipResponse])
async def get_organization_members(
    org_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get all members of organization"""
    member_repo = OrganizationMembershipRepository(db)
    
    members = await member_repo.get_org_members(org_id)
    return members
