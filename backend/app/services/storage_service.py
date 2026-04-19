import boto3
from botocore.exceptions import ClientError
from app.core.config import settings


def _get_s3_client():
    return boto3.client(
        "s3",
        aws_access_key_id=settings.aws_access_key_id,
        aws_secret_access_key=settings.aws_secret_access_key,
        region_name=settings.aws_region,
    )


async def upload_file_to_s3(file_bytes: bytes, s3_key: str, content_type: str = "application/octet-stream") -> str:
    """
    Upload file bytes to S3 and return the S3 key.
    Raises an exception if upload fails.
    """
    client = _get_s3_client()
    try:
        client.put_object(
            Bucket=settings.aws_s3_bucket_name,
            Key=s3_key,
            Body=file_bytes,
            ContentType=content_type,
        )
        return s3_key
    except ClientError as e:
        raise RuntimeError(f"S3 upload failed: {e}")


def get_s3_url(s3_key: str) -> str:
    """Returns the public S3 URL for a given key."""
    return f"https://{settings.aws_s3_bucket_name}.s3.{settings.aws_region}.amazonaws.com/{s3_key}"
