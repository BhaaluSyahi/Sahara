from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    database_url: str
    
    # JWT
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Supabase
    supabase_url: Optional[str] = None
    supabase_key: Optional[str] = None
    supabase_bucket_name: str = "documents"
    
    # Agent URLs
    doc_extraction_agent_url: str = "http://localhost:8001/extract"
    request_research_agent_url: str = "http://localhost:8002/research"
    
    # App
    debug: bool = False
    app_name: str = "Volunteer Matching Backend"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
