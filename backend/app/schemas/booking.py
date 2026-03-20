from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.user import UserOut


class BookingCreate(BaseModel):
    service_name: str = Field(min_length=1, max_length=200)
    notes: str | None = None
    start_at: datetime
    end_at: datetime


class BookingUpdate(BaseModel):
    service_name: str | None = Field(default=None, min_length=1, max_length=200)
    notes: str | None = None
    status: str | None = None
    start_at: datetime | None = None
    end_at: datetime | None = None


class BookingOut(BaseModel):
    id: int
    user_id: int | None
    service_name: str
    notes: str | None
    status: str
    start_at: datetime
    end_at: datetime
    user: UserOut | None = None
    created_at: datetime

    model_config = {"from_attributes": True}

