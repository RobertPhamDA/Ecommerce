from __future__ import annotations

from fastapi import APIRouter, Depends, File, UploadFile

from app.api.deps import require_role
from app.models.user import UserRole
from app.services.supabase_storage import upload_file

router = APIRouter(prefix="/uploads", tags=["uploads"])


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    _admin=Depends(require_role(UserRole.admin)),
):
    content = await file.read()
    url = await upload_file(
        content=content,
        filename=file.filename or "image",
        content_type=file.content_type,
        prefix="images",
    )
    return {"url": url}

