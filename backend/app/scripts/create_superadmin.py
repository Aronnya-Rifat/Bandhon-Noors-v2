from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User, UserRole


def create_admin():
    db: Session = SessionLocal()

    try:
        name = input("Admin name: ")
        email = input("Admin email: ")
        phone = input("Admin phone (optional): ")
        password = input("Admin password: ")

        existing_user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if existing_user:
            print("A user with this email already exists.")
            return

        admin = User(
            name=name,
            email=email,
            phone=phone if phone else None,
            password_hash=hash_password(password),
            role=UserRole.SUPER_ADMIN,
            is_active=True,
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        print("Super admin created successfully.")
        print(f"User ID: {admin.id}")
        print(f"Email: {admin.email}")
        print(f"Role: {admin.role.value}")

    finally:
        db.close()


if __name__ == "__main__":
    create_admin()