from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.user import UserOut


class CommentCreate(BaseModel):
    post_id: int | None = None
    product_id: int | None = None
    content: str = Field(min_length=1)


class CommentOut(BaseModel):
    id: int
    post_id: int | None
    product_id: int | None
    user_id: int | None
    content: str
    user: UserOut | None = None
    created_at: datetime

    model_config = {"from_attributes": True}

