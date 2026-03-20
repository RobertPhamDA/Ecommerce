from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.db.session import get_db
from app.models.booking import Booking
from app.models.user import User, UserRole
from app.schemas.booking import BookingCreate, BookingOut, BookingUpdate

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.get("", response_model=list[BookingOut])
def list_bookings(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    limit: int = Query(default=50, le=200),
    offset: int = Query(default=0, ge=0),
):
    stmt = select(Booking).order_by(Booking.created_at.desc())
    if user.role != UserRole.admin:
        stmt = stmt.where(Booking.user_id == user.id)
    stmt = stmt.limit(limit).offset(offset)
    return list(db.scalars(stmt))


@router.get("/{booking_id}", response_model=BookingOut)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    obj = db.get(Booking, booking_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Booking not found")
    if user.role != UserRole.admin and obj.user_id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    return obj


@router.post("", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
def create_booking(
    payload: BookingCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if payload.end_at <= payload.start_at:
        raise HTTPException(status_code=400, detail="end_at must be after start_at")
    obj = Booking(user_id=user.id, **payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.patch("/{booking_id}", response_model=BookingOut)
def update_booking(
    booking_id: int,
    payload: BookingUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    obj = db.get(Booking, booking_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Booking not found")

    # user can edit their booking except status; admin can edit all fields
    if user.role != UserRole.admin and obj.user_id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    updates = payload.model_dump(exclude_unset=True)
    if user.role != UserRole.admin and "status" in updates:
        raise HTTPException(status_code=403, detail="Only admin can change status")
    if "start_at" in updates or "end_at" in updates:
        start_at = updates.get("start_at", obj.start_at)
        end_at = updates.get("end_at", obj.end_at)
        if end_at <= start_at:
            raise HTTPException(status_code=400, detail="end_at must be after start_at")
    for k, v in updates.items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_role(UserRole.admin))])
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    obj = db.get(Booking, booking_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Booking not found")
    db.delete(obj)
    db.commit()

