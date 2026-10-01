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
    email = (
        str(data.email)
        .strip()
        .lower()
    )

    phone = (
        data.phone.strip()
        if data.phone
        else None
    )
    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )
    
    if existing_user:
        raise ValueError(
            "Email already registered"
        )
    if phone:
        existing_phone = (
            db.query(User)
            .filter(
                User.phone == phone
            )
            .first()
        )

        if existing_phone:
            raise ValueError(
                "Phone number already registered"
            )
    admin = User(
        name=data.name.strip(),
        email=email,
        phone=phone,
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

def get_admin_users(
    db: Session,
) -> list[User]:
    """
    Return administrators and
    super administrators.
    """

    return (
        db.query(User)
        .filter(
            User.role.in_(
                [
                    UserRole.ADMIN,
                    UserRole.SUPER_ADMIN,
                ]
            )
        )
        .order_by(
            User.created_at.desc(),
            User.id.desc(),
        )
        .all()
    )


def update_admin_status(
    db: Session,
    admin_id: int,
    is_active: bool,
    current_user: User,
) -> User:
    """
    Activate or deactivate a regular
    administrator account.
    """

    admin = (
        db.query(User)
        .filter(
            User.id == admin_id
        )
        .first()
    )

    if admin is None:
        raise ValueError(
            "Administrator not found"
        )

    if admin.role == UserRole.SUPER_ADMIN:
        raise ValueError(
            "Super administrator accounts cannot be disabled here"
        )

    if admin.role != UserRole.ADMIN:
        raise ValueError(
            "The selected user is not an administrator"
        )

    if admin.id == current_user.id:
        raise ValueError(
            "You cannot disable your own account"
        )

    admin.is_active = is_active

    db.commit()
    db.refresh(admin)

    return admin
