from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    database_url: str
    
    # JWT
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # AWS
    aws_access_key_id: str
    aws_secret_access_key: str
    aws_region: str = "ap-south-1"
    aws_s3_bucket_name: str
    # SMTP Email
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 465
    smtp_sender_email: Optional[str] = None
    smtp_password: Optional[str] = None
    
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
