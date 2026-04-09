import httpx
from app.core.config import settings
import asyncio


class DocumentExtractionService:
    """Service to call document extraction agent"""
    
    @staticmethod
    async def extract_from_document(file_path: str, doc_id: str) -> dict:
        """
        Simulates calling an external document extraction agent.
        In production, this would send the document to the agent URL.
        """
        try:
            # Simulate async extraction
            await asyncio.sleep(1)
            
            # Mock extracted data
            return {
                "status": "success",
                "extracted_fields": {
                    "organization_name": "Sample NGO",
                    "address": "123 Main St",
                    "phone": "+1-555-0000",
                    "email": "contact@ngo.org",
                    "registration_number": "REG123456",
                    "type": "ngo",
                    "founded_year": 2020,
                },
                "confidence": 0.95,
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
            }


class RequestResearchService:
    """Service to call request research/matching agent"""
    
    @staticmethod
    async def research_request(request_id: str, request_data: dict) -> dict:
        """
        Simulates calling an external request research agent.
        Returns recommendations and infoboard data.
        """
        try:
            # Simulate async research
            await asyncio.sleep(2)
            
            # Mock recommendations and infoboard
            return {
                "status": "success",
                "recommendations": {
                    "organizations": [
                        {"id": "org_123", "name": "Relief NGO", "match_score": 0.92},
                        {"id": "org_456", "name": "Community Services", "match_score": 0.85},
                    ],
                    "volunteers": [
                        {"id": "vol_789", "name": "John Doe", "match_score": 0.88},
                        {"id": "vol_101", "name": "Jane Smith", "match_score": 0.82},
                    ],
                },
                "infoboard": {
                    "related_requests": 3,
                    "similar_entities": 5,
                    "additional_context": "High urgency area",
                },
                "progress": 100,
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
            }
