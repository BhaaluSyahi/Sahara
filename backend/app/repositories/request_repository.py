from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.entities import Request, RequestParticipant
from app.models.schemas import RequestCreate, RequestUpdate
from uuid import UUID
from typing import Optional


class RequestRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, issuer_type: str, issuer_id: UUID, data: RequestCreate) -> Request:
        db_request = Request(
            issuer_type=issuer_type,
            issuer_id=issuer_id,
            **data.model_dump()
        )
        self.db.add(db_request)
        await self.db.commit()
        await self.db.refresh(db_request)
        return db_request
    
    async def get_by_id(self, request_id: UUID) -> Request | None:
        result = await self.db.execute(
            select(Request).where(Request.id == request_id)
        )
        return result.scalars().first()
    
    async def update(self, request_id: UUID, data: RequestUpdate) -> Request | None:
        request = await self.get_by_id(request_id)
        if not request:
            return None
        
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(request, key, value)
        
        await self.db.commit()
        await self.db.refresh(request)
        return request
    
    async def update_progress(self, request_id: UUID, progress_percent: int, recommendations: dict = None, infoboard: dict = None, agent_status: str = None) -> Request | None:
        request = await self.get_by_id(request_id)
        if not request:
            return None
        
        request.progress_percent = progress_percent
        if recommendations:
            request.recommendations = recommendations
        if infoboard:
            request.infoboard = infoboard
        if agent_status:
            request.agent_research_status = agent_status
        
        await self.db.commit()
        await self.db.refresh(request)
        return request
    
    async def list_by_issuer(
        self,
        issuer_type: str,
        issuer_id: UUID,
        status: Optional[str] = None,
        title: Optional[str] = None,
    ) -> list[Request]:
        query = select(Request).where(
            (Request.issuer_type == issuer_type) &
            (Request.issuer_id == issuer_id) &
            (Request.status != "deleted")
        )
        if status:
            query = query.where(Request.status == status)
        if title:
            query = query.where(Request.title.ilike(f"%{title}%"))
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def list_all_open(self) -> list[Request]:
        result = await self.db.execute(
            select(Request).where(Request.status == "open")
        )
        return result.scalars().all()


class RequestParticipantRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, request_id: UUID, volunteer_id: UUID, role: str = "participant") -> RequestParticipant:
        db_participant = RequestParticipant(
            request_id=request_id,
            volunteer_id=volunteer_id,
            role=role,
        )
        self.db.add(db_participant)
        await self.db.commit()
        await self.db.refresh(db_participant)
        return db_participant
    
    async def get_by_id(self, participant_id: UUID) -> RequestParticipant | None:
        result = await self.db.execute(
            select(RequestParticipant).where(RequestParticipant.id == participant_id)
        )
        return result.scalars().first()
    
    async def get_request_participants(self, request_id: UUID) -> list[RequestParticipant]:
        result = await self.db.execute(
            select(RequestParticipant).where(RequestParticipant.request_id == request_id)
        )
        return result.scalars().all()
    
    async def update_credit(self, participant_id: UUID, credit_percent: int) -> RequestParticipant | None:
        participant = await self.get_by_id(participant_id)
        if not participant:
            return None
        
        participant.credit_percent = credit_percent
        await self.db.commit()
        await self.db.refresh(participant)
        return participant
