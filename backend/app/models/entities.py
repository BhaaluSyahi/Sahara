from sqlalchemy import Column, String, Boolean, DateTime, Text, Integer, ForeignKey, func, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base
import uuid

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)  # employee, volunteer
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class VolunteerProfile(Base):
    __tablename__ = "volunteer_profiles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    latitude = Column(String, nullable=True)
    longitude = Column(String, nullable=True)
    specialty = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # village, ngo, other
    description = Column(Text, nullable=True)
    verified = Column(Boolean, default=False)
    status = Column(String, nullable=False, default="draft")  # draft, pending, registered, rejected
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    verified_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class OrganizationDocument(Base):
    __tablename__ = "organization_documents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    storage_path = Column(String, nullable=False)
    filename = Column(String, nullable=False)
    extracted_data = Column(JSON, nullable=True)
    agent_status = Column(String, nullable=False, default="pending")  # pending, completed, failed
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class OrganizationMembership(Base):
    __tablename__ = "organization_memberships"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    volunteer_id = Column(UUID(as_uuid=True), ForeignKey("volunteer_profiles.id"), nullable=False)
    role = Column(String, nullable=False)  # admin, subadmin, member
    added_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    joined_at = Column(DateTime, server_default=func.now())
    is_active = Column(Boolean, default=True)


class Request(Base):
    __tablename__ = "requests"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    location_type = Column(String, nullable=False)  # online, location
    location_text = Column(String, nullable=True)
    latitude = Column(String, nullable=True)
    longitude = Column(String, nullable=True)
    issuer_type = Column(String, nullable=False)  # volunteer, organization
    issuer_id = Column(UUID(as_uuid=True), nullable=False)
    status = Column(String, nullable=False, default="open")  # open, closed, deleted
    progress_percent = Column(Integer, default=0)
    recommendations = Column(JSON, nullable=True)
    infoboard = Column(JSON, nullable=True)
    agent_research_status = Column(String, nullable=False, default="pending")  # pending, in_progress, complete
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class RequestParticipant(Base):
    __tablename__ = "request_participants"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    request_id = Column(UUID(as_uuid=True), ForeignKey("requests.id"), nullable=False)
    volunteer_id = Column(UUID(as_uuid=True), ForeignKey("volunteer_profiles.id"), nullable=False)
    joined_at = Column(DateTime, server_default=func.now())
    credit_percent = Column(Integer, default=0)
    role = Column(String, nullable=False)  # participant, leader, support


class Rating(Base):
    __tablename__ = "ratings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    from_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    target_type = Column(String, nullable=False)  # organization, volunteer
    target_id = Column(UUID(as_uuid=True), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
