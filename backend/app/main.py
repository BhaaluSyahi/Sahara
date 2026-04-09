from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.routers import auth, volunteers, organizations, requests, ratings

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Volunteer Matching System Backend"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(volunteers.router)
app.include_router(organizations.router)
app.include_router(requests.router)
app.include_router(ratings.router)


@app.get("/")
async def root():
    return {"message": "Welcome to Volunteer Matching Backend"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
