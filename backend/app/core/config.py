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
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None
    aws_region: str = "ap-south-1"
    aws_s3_bucket_name: Optional[str] = None
    
    # Supabase
    supabase_url: Optional[str] = None
    supabase_key: Optional[str] = None
    supabase_bucket_name: Optional[str] = None
    # SMTP Email
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 465
    smtp_sender_email: Optional[str] = None
    smtp_password: Optional[str] = None
    
    # Agent URLs
    doc_extraction_agent_url: str = "http://localhost:8001/extract"
    request_research_agent_url: str = "http://localhost:8002/research"
    
    # SQS Queue URLs
    sqs_enrich_floods_url: Optional[str] = None
    sqs_enrich_drought_url: Optional[str] = None
    sqs_enrich_healthcare_url: Optional[str] = None
    sqs_enrich_disaster_url: Optional[str] = None
    sqs_enrich_welfare_url: Optional[str] = None
    sqs_enrich_education_url: Optional[str] = None
    sqs_enrich_livelihood_url: Optional[str] = None
    sqs_enrich_environment_url: Optional[str] = None
    sqs_enrich_regional_url: Optional[str] = None
    
    # Gemini API
    gemini_api_key: Optional[str] = None
    
    # App
    debug: bool = False
    app_name: str = "Volunteer Matching Backend"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
