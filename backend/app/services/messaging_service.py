import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from enum import Enum
from app.core.config import settings


class MessageChannel(str, Enum):
    EMAIL = "email"
    WHATSAPP = "whatsapp"
    IN_APP = "in_app"


class MessagingService:
    """Service to send notifications through various channels"""

    @staticmethod
    async def send_email(recipient: str, subject: str, body: str) -> bool:
        """Send email via SMTP (aiosmtplib)"""
        if not settings.smtp_sender_email or not settings.smtp_password:
            print(f"[EMAIL SKIPPED] SMTP credentials not configured. To: {recipient}")
            return False

        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = settings.smtp_sender_email
        message["To"] = recipient
        message.attach(MIMEText(body, "plain"))

        try:
            await aiosmtplib.send(
                message,
                hostname=settings.smtp_host,
                port=settings.smtp_port,
                username=settings.smtp_sender_email,
                password=settings.smtp_password,
                use_tls=True,
            )
            return True
        except Exception as e:
            print(f"[EMAIL ERROR] SMTP failed: {e}")
            return False

    @staticmethod
    async def send_whatsapp(phone_number: str, message: str) -> bool:
        """Placeholder — integrate Twilio or Meta Cloud API for WhatsApp"""
        print(f"[WHATSAPP] To: {phone_number}")
        print(f"Message: {message}")
        return True

    @staticmethod
    async def send_in_app(user_id: str, title: str, body: str) -> bool:
        """Placeholder — integrate with push notification service"""
        print(f"[IN_APP] User: {user_id}, Title: {title}")
        print(f"Body: {body}")
        return True

    @staticmethod
    async def notify_request_participants(request_id: str, channel: MessageChannel, message: str) -> bool:
        """Send notifications to all request participants"""
        print(f"[{channel.value.upper()}] Notifying participants of request {request_id}")
        print(f"Message: {message}")
        return True
