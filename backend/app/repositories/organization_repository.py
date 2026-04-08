from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.entities import Organization, OrganizationDocument, OrganizationMembership
from app.models.schemas import OrganizationCreate, OrganizationUpdate
from uuid import UUID


class OrganizationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, created_by: UUID, data: OrganizationCreate) -> Organization:
        db_org = Organization(
            created_by=created_by,
            status="draft",
            **data.model_dump()
        )
        self.db.add(db_org)
        await self.db.commit()
        await self.db.refresh(db_org)
        return db_org
    
    async def get_by_id(self, org_id: UUID) -> Organization | None:
        result = await self.db.execute(
            select(Organization).where(Organization.id == org_id)
        )
        return result.scalars().first()
    
    async def update(self, org_id: UUID, data: OrganizationUpdate) -> Organization | None:
        org = await self.get_by_id(org_id)
        if not org:
            return None
        
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(org, key, value)
        
        await self.db.commit()
        await self.db.refresh(org)
        return org
    
    async def list_all(self) -> list[Organization]:
        result = await self.db.execute(select(Organization))
        return result.scalars().all()


class OrganizationDocumentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, org_id: UUID, uploaded_by: UUID, filename: str, storage_path: str) -> OrganizationDocument:
        db_doc = OrganizationDocument(
            organization_id=org_id,
            uploaded_by=uploaded_by,
            filename=filename,
            storage_path=storage_path,
        )
        self.db.add(db_doc)
        await self.db.commit()
        await self.db.refresh(db_doc)
        return db_doc
    
    async def get_by_id(self, doc_id: UUID) -> OrganizationDocument | None:
        result = await self.db.execute(
            select(OrganizationDocument).where(OrganizationDocument.id == doc_id)
        )
        return result.scalars().first()
    
    async def update_extracted_data(self, doc_id: UUID, extracted_data: dict, status: str = "completed") -> OrganizationDocument | None:
        doc = await self.get_by_id(doc_id)
        if not doc:
            return None
        
        doc.extracted_data = extracted_data
        doc.agent_status = status
        await self.db.commit()
        await self.db.refresh(doc)
        return doc


class OrganizationMembershipRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, org_id: UUID, volunteer_id: UUID, added_by: UUID, role: str = "member") -> OrganizationMembership:
        db_membership = OrganizationMembership(
            organization_id=org_id,
            volunteer_id=volunteer_id,
            added_by=added_by,
            role=role,
        )
        self.db.add(db_membership)
        await self.db.commit()
        await self.db.refresh(db_membership)
        return db_membership
    
    async def get_by_id(self, membership_id: UUID) -> OrganizationMembership | None:
        result = await self.db.execute(
            select(OrganizationMembership).where(OrganizationMembership.id == membership_id)
        )
        return result.scalars().first()
    
    async def get_org_members(self, org_id: UUID) -> list[OrganizationMembership]:
        result = await self.db.execute(
            select(OrganizationMembership).where(
                (OrganizationMembership.organization_id == org_id) & 
                (OrganizationMembership.is_active == True)
            )
        )
        return result.scalars().all()
    
    async def get_volunteer_orgs(self, volunteer_id: UUID) -> list[OrganizationMembership]:
        result = await self.db.execute(
            select(OrganizationMembership).where(
                (OrganizationMembership.volunteer_id == volunteer_id) & 
                (OrganizationMembership.is_active == True)
            )
        )
        return result.scalars().all()
    
    async def update_role(self, membership_id: UUID, new_role: str) -> OrganizationMembership | None:
        membership = await self.get_by_id(membership_id)
        if not membership:
            return None
        
        membership.role = new_role
        await self.db.commit()
        await self.db.refresh(membership)
        return membership
