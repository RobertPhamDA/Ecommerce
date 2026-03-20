from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.product import ProductOut
from app.schemas.user import UserOut


class OrderBase(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1)
    customer_name: str
    customer_phone: str
    customer_address: str


class OrderCreate(OrderBase):
    pass


class OrderOut(OrderBase):
    id: int
    user_id: Optional[int]
    total_price: float
    status: str
    created_at: datetime
    product: Optional[ProductOut]
    user: Optional[UserOut]

    model_config = ConfigDict(from_attributes=True)


class OrderUpdate(BaseModel):
    status: Optional[str] = None
