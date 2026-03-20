from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import require_role
from app.db.session import get_db
from app.models.post import Post
from app.models.user import UserRole
from app.schemas.post import PostCreate, PostOut, PostUpdate

router = APIRouter(prefix="/posts", tags=["posts"])


@router.get("", response_model=list[PostOut])
def list_posts(
    db: Session = Depends(get_db),
    q: str | None = Query(default=None),
    published: bool | None = Query(default=True),
    limit: int = Query(default=50, le=200),
    offset: int = Query(default=0, ge=0),
):
    stmt = select(Post).order_by(Post.created_at.desc())
    if q:
        stmt = stmt.where(Post.title.ilike(f"%{q}%"))
    if published is not None:
        stmt = stmt.where(Post.published == published)
    stmt = stmt.limit(limit).offset(offset)
    return list(db.scalars(stmt))


@router.get("/{post_id}", response_model=PostOut)
def get_post(post_id: int, db: Session = Depends(get_db)):
    obj = db.get(Post, post_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Post not found")
    return obj


@router.post("", response_model=PostOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_role(UserRole.admin))])
def create_post(payload: PostCreate, db: Session = Depends(get_db)):
    exists = db.scalar(select(Post).where(Post.slug == payload.slug))
    if exists:
        raise HTTPException(status_code=400, detail="Post slug already exists")
    obj = Post(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.patch("/{post_id}", response_model=PostOut, dependencies=[Depends(require_role(UserRole.admin))])
def update_post(post_id: int, payload: PostUpdate, db: Session = Depends(get_db)):
    obj = db.get(Post, post_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Post not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_role(UserRole.admin))])
def delete_post(post_id: int, db: Session = Depends(get_db)):
    obj = db.get(Post, post_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(obj)
    db.commit()

