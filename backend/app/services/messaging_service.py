from enum import Enum


class MessageChannel(str, Enum):
    EMAIL = "email"
    WHATSAPP = "whatsapp"
    IN_APP = "in_app"


class MessagingService:
    """Service to send notifications through various channels"""
    
    @staticmethod
    async def send_email(recipient: str, subject: str, body: str) -> bool:
        """Simulate sending email"""
        print(f"[EMAIL] To: {recipient}, Subject: {subject}")
        print(f"Body: {body}")
        return True
    
    @staticmethod
    async def send_whatsapp(phone_number: str, message: str) -> bool:
        """Simulate sending WhatsApp message"""
        print(f"[WHATSAPP] To: {phone_number}")
        print(f"Message: {message}")
        return True
    
    @staticmethod
    async def send_in_app(user_id: str, title: str, body: str) -> bool:
        """Simulate sending in-app notification"""
        print(f"[IN_APP] User: {user_id}, Title: {title}")
        print(f"Body: {body}")
        return True
    
    @staticmethod
    async def notify_request_participants(request_id: str, channel: MessageChannel, message: str) -> bool:
        """Send notifications to all request participants"""
        # In production, this would query DB for participants and send to each
        print(f"[{channel.value.upper()}] Notifying participants of request {request_id}")
        print(f"Message: {message}")
        return True
