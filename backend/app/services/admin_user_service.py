from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User, UserRole
from app.schemas.admin_user import AdminCreateRequest


def create_admin_user(
    db: Session,
    data: AdminCreateRequest,
) -> User:
    """
    Create a new admin account.

    Only SUPER_ADMIN should call this service.
    """

    existing_user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if existing_user:
        raise ValueError(
            "Email already registered"
        )

    admin = User(
        name=data.name,
        email=data.email,
        phone=data.phone,
        password_hash=hash_password(
            data.password
        ),
        role=UserRole.ADMIN,
        is_active=True,
    )

    db.add(admin)
    db.commit()
    db.refresh(admin)

    return admin