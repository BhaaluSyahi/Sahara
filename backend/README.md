# Volunteer Matching Backend

FastAPI backend for a volunteer matching system built with modular architecture and clean separation of concerns.

## Project Structure

```
backend/
├── app/
│   ├── api/v1/routers/          # API endpoints
│   │   ├── auth.py              # Authentication endpoints
│   │   ├── volunteers.py        # Volunteer management
│   │   ├── organizations.py     # Organization management
│   │   ├── requests.py          # Request management
│   │   └── ratings.py           # Rating endpoints
│   ├── core/
│   │   ├── config.py            # Configuration management
│   │   └── security.py          # JWT & auth utilities
│   ├── db/
│   │   └── base.py              # Database connection & session
│   ├── models/
│   │   ├── entities.py          # SQLAlchemy ORM models
│   │   └── schemas.py           # Pydantic request/response schemas
│   ├── repositories/            # Data access layer
│   │   ├── user_repository.py
│   │   ├── volunteer_repository.py
│   │   ├── organization_repository.py
│   │   ├── request_repository.py
│   │   └── rating_repository.py
│   ├── services/                # Business logic & adapters
│   │   ├── ai_service.py        # AI/agent adapters (doc extraction, research)
│   │   └── messaging_service.py # Messaging adapters (email, WhatsApp, in-app)
│   └── main.py                  # FastAPI app bootstrap
├── migrations/                  # Alembic migrations
├── pyproject.toml              # Project dependencies (UV)
├── .env.example                # Environment template
└── README.md                   # This file
```

## Setup

### Prerequisites
- Python 3.11+
- PostgreSQL (or Supabase)
- UV (Python package manager)

### Installation

1. Clone the repo and navigate to backend:
```bash
cd backend
```

2. Create `.env` file from template:
```bash
cp .env.example .env
```

3. Update `.env` with your database and settings:
```
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/volunteer_matching
SECRET_KEY=your-secret-key
```

4. Install dependencies with UV:
```bash
uv sync
```

5. Run migrations (if using Alembic):
```bash
alembic upgrade head
```

### Running the app

Start the development server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### API Documentation

Once running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Core Features

### 1. Authentication
- Employee and volunteer registration/login
- JWT-based auth
- Role-based access control

### 2. Organizations
- Employee creates organizations
- Admin/subadmin can add volunteers to org
- Admin transfer and role management
- Document upload for verification

### 3. Volunteers
- Self-register as volunteer
- Create and manage profiles
- Join organizations (by admin invite)
- Join requests

### 4. Requests
- Create request at 0% progress
- Async AI agent research (simulated)
- Track progress, recommendations, infoboard
- Participants get credit

### 5. Ratings
- Volunteers rate organizations
- Organizations rate volunteers
- Bidirectional ratings

### 6. AI Adapters (Simulated)
- **Document Extraction**: Extract data from org docs (simulated)
- **Request Research**: Research and match requests (simulated)

### 7. Messaging (Simulated)
- Email notifications
- WhatsApp messages
- In-app notifications

## Database Schema

### Tables
- `users` — Employees and volunteers with JWT auth
- `volunteer_profiles` — Profile data (name, contact, specialty)
- `organizations` — NGOs, villages, companies
- `organization_documents` — Uploaded docs with extracted data
- `organization_memberships` — Volunteer-org relationships
- `requests` — Help requests with progress tracking
- `request_participants` — Participants and credit
- `ratings` — Bidirectional star ratings

## Key Design Decisions

1. **Repository Pattern**: All data access goes through repositories for clean separation
2. **Async/Await**: Built with async SQLAlchemy for better concurrency
3. **Background Tasks**: Request research runs async in background
4. **Simulated Agents**: AI services are pluggable and currently simulated
5. **Text Enums**: All enums stored as text for schema flexibility

## Testing

Run tests with pytest:
```bash
pytest
```

With coverage:
```bash
pytest --cov=app
```

## Next Steps

1. Wire up actual Supabase Storage for document uploads
2. Implement real AI agent endpoints
3. Add email/SMS messaging providers
4. Deploy to production environment
5. Add comprehensive test coverage
