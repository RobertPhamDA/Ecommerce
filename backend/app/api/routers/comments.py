from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.db.session import get_db
from app.models.comment import Comment
from app.models.post import Post
from app.models.product import Product
from app.models.user import User, UserRole
from app.schemas.comment import CommentCreate, CommentOut

router = APIRouter(prefix="/comments", tags=["comments"])


@router.get("", response_model=list[CommentOut])
def list_comments(
    db: Session = Depends(get_db),
    post_id: int | None = Query(default=None),
    product_id: int | None = Query(default=None),
    limit: int = Query(default=100, le=200),
    offset: int = Query(default=0, ge=0),
):
    stmt = select(Comment).order_by(Comment.created_at.desc())
    if post_id is not None:
        stmt = stmt.where(Comment.post_id == post_id)
    if product_id is not None:
        stmt = stmt.where(Comment.product_id == product_id)
    stmt = stmt.limit(limit).offset(offset)
    return list(db.scalars(stmt))


@router.post("", response_model=CommentOut, status_code=status.HTTP_201_CREATED)
def create_comment(
    payload: CommentCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not payload.post_id and not payload.product_id:
        raise HTTPException(status_code=400, detail="Must provide post_id or product_id")

    if payload.post_id and not db.get(Post, payload.post_id):
        raise HTTPException(status_code=404, detail="Post not found")
        
    if payload.product_id and not db.get(Product, payload.product_id):
        raise HTTPException(status_code=404, detail="Product not found")

    obj = Comment(post_id=payload.post_id, product_id=payload.product_id, user_id=user.id, content=payload.content)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    obj = db.get(Comment, comment_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Comment not found")

    is_owner = obj.user_id == user.id
    is_admin = user.role == UserRole.admin
    if not (is_owner or is_admin):
        raise HTTPException(status_code=403, detail="Forbidden")

    db.delete(obj)
    db.commit()

