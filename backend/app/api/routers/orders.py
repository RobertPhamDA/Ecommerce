from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user_optional, require_role
from app.db.session import get_db
from app.models.order import Order
from app.models.product import Product
from app.models.user import User, UserRole
from app.schemas.order import OrderCreate, OrderOut, OrderUpdate

router = APIRouter(prefix="/orders", tags=["orders"])

@router.get("", response_model=list[OrderOut])
def list_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.admin)),
    limit: int = Query(default=50, le=200),
    offset: int = Query(default=0, ge=0),
):
    stmt = select(Order).order_by(Order.created_at.desc()).limit(limit).offset(offset)
    return list(db.scalars(stmt))

@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    product = db.get(Product, payload.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    total_price = float(product.price) * payload.quantity

    obj = Order(
        user_id=current_user.id if current_user else None,
        product_id=product.id,
        quantity=payload.quantity,
        total_price=total_price,
        customer_name=payload.customer_name,
        customer_phone=payload.customer_phone,
        customer_address=payload.customer_address,
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.patch("/{order_id}", response_model=OrderOut, dependencies=[Depends(require_role(UserRole.admin))])
def update_order(order_id: int, payload: OrderUpdate, db: Session = Depends(get_db)):
    obj = db.get(Order, order_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Order not found")
    if payload.status is not None:
        obj.status = payload.status
    db.commit()
    db.refresh(obj)
    return obj
