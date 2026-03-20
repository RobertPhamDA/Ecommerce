from __future__ import annotations

import getpass

from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import get_sessionmaker
from app.models.user import User, UserRole


def main() -> None:
    SessionLocal = get_sessionmaker()
    db = SessionLocal()
    try:
        email = input("Admin email: ").strip().lower()
        password = getpass.getpass("Admin password (min 8 chars): ").strip()
        if len(password) < 8:
            raise SystemExit("Password too short")

        existing = db.scalar(select(User).where(User.email == email))
        if existing:
            existing.role = UserRole.admin
            existing.hashed_password = hash_password(password)
            print("Updated existing user to admin.")
        else:
            db.add(User(email=email, hashed_password=hash_password(password), role=UserRole.admin))
            print("Created new admin user.")

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    main()

