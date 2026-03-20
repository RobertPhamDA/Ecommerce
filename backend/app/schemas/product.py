from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.category import CategoryOut


class ProductBase(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    slug: str = Field(min_length=1, max_length=220)
    description: str | None = None
    price: float = Field(gt=0)
    currency: str = Field(default="USD", min_length=3, max_length=3)
    image_url: str | None = None
    category_id: int | None = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    slug: str | None = Field(default=None, min_length=1, max_length=220)
    description: str | None = None
    price: float | None = Field(default=None, gt=0)
    currency: str | None = Field(default=None, min_length=3, max_length=3)
    image_url: str | None = None
    category_id: int | None = None


class ProductOut(ProductBase):
    id: int
    category: CategoryOut | None = None
    created_at: datetime

    model_config = {"from_attributes": True}

