from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class PostBase(BaseModel):
    title: str = Field(min_length=1, max_length=240)
    slug: str = Field(min_length=1, max_length=260)
    excerpt: str | None = None
    content: str = Field(min_length=1)
    cover_image_url: str | None = None
    published: bool = True


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=240)
    slug: str | None = Field(default=None, min_length=1, max_length=260)
    excerpt: str | None = None
    content: str | None = Field(default=None, min_length=1)
    cover_image_url: str | None = None
    published: bool | None = None


class PostOut(PostBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}

