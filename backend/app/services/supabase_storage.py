from __future__ import annotations

import mimetypes
import uuid

import httpx

from app.core.config import get_settings
from app.core.config import validate_storage_settings


def _public_object_url(bucket: str, object_path: str) -> str:
    s = get_settings()
    # Supabase public URL format for objects in a public bucket.
    return f"{s.supabase_url.rstrip('/')}/storage/v1/object/public/{bucket}/{object_path}"


async def upload_file(
    *,
    content: bytes,
    filename: str,
    content_type: str | None = None,
    prefix: str = "images",
) -> str:
    s = get_settings()
    validate_storage_settings(s)
    # Keep object_path in a predictable folder; Supabase stores exact key names.
    safe_name = (filename or "image").replace("\\", "/").split("/")[-1]
    content_type_final = content_type or mimetypes.guess_type(safe_name)[0] or "application/octet-stream"

    object_path = f"{prefix}/{uuid.uuid4().hex}-{safe_name}"
    bucket = s.supabase_storage_bucket_images

    url = f"{s.supabase_url.rstrip('/')}/storage/v1/object/{bucket}/{object_path}"

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            url,
            headers={
                "Authorization": f"Bearer {s.supabase_service_role_key}",
                "Content-Type": content_type_final,
                "x-upsert": "true",
            },
            content=content,
        )
        resp.raise_for_status()

    return _public_object_url(bucket=bucket, object_path=object_path)

