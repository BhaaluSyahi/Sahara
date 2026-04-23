import json
import boto3
import os
from datetime import datetime
from typing import Dict, Any, Optional
from app.core.config import settings


class QueueService:
    """Service for managing AWS SQS queues for request processing"""
    
    def __init__(self):
        self.sqs_client = boto3.client(
            'sqs',
            region_name=settings.aws_region,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key
        )
        
        # Category to queue mapping
        self.QUEUE_URLS = {
            "floods": settings.sqs_enrich_floods_url,
            "drought": settings.sqs_enrich_drought_url,
            "healthcare": settings.sqs_enrich_healthcare_url,
            "disaster": settings.sqs_enrich_disaster_url,
            "welfare": settings.sqs_enrich_welfare_url,
            "education": settings.sqs_enrich_education_url,
            "livelihood": settings.sqs_enrich_livelihood_url,
            "environment": settings.sqs_enrich_environment_url,
            "regional": settings.sqs_enrich_regional_url,
        }
    
    def get_queue_url(self, category: str) -> Optional[str]:
        """Get SQS queue URL based on category"""
        return self.QUEUE_URLS.get(category.lower())
    
    async def publish_request(self, request_id: str, category: str, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Publish request to appropriate SQS queue based on category"""
        queue_url = self.get_queue_url(category)
        
        if not queue_url:
            return {
                "status": "error",
                "message": f"No queue configured for category: {category}"
            }
        
        message = {
            "request_id": request_id,
            "category": category,
            "data": request_data,
            "timestamp": str(datetime.utcnow().isoformat())
        }
        
        try:
            response = self.sqs_client.send_message(
                QueueUrl=queue_url,
                MessageBody=json.dumps(message),
                MessageGroupId=request_id,  # For FIFO queues
                MessageDeduplicationId=f"{request_id}_{int(datetime.utcnow().timestamp())}"
            )
            
            return {
                "status": "success",
                "message_id": response["MessageId"],
                "queue_url": queue_url,
                "category": category
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": str(e),
                "queue_url": queue_url,
                "category": category
            }
    
    async def get_queue_status(self, request_id: str) -> Dict[str, Any]:
        """Check status of request in queues (placeholder implementation)"""
        # This would typically query the processing status from your backend
        # For now, return a placeholder response
        return {
            "request_id": request_id,
            "status": "queued",
            "message": "Request is being processed"
        }


# Global queue service instance
queue_service = QueueService()
