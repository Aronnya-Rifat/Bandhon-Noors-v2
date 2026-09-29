from sqlalchemy import or_, select
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.security import (
    create_access_token,
    verify_password,
)
from app.models.admin_invitation import (
    AdminInvitation,
    AdminInvitationStatus,
)

from app.models.user import (
    User,
    UserRole,
)

from app.schemas.auth import RegisterRequest
from app.core.security import hash_password

def authenticate_user(
    db: Session,
    login: str,
    password: str,
) -> User | None:
    """
    Authenticate user using email or phone.

    Returns:
        User object if credentials are valid.
        None if authentication fails.
    """

    statement = select(User).where(
        or_(
            User.email == login,
            User.phone == login,
        )
    )

    user = db.execute(statement).scalar_one_or_none()

    if user is None:
        return None

    if not verify_password(
        password,
        user.password_hash,
    ):
        return None

    if not user.is_active:
        return None

    return user


def create_user_token(
    user: User,
) -> str:
    """
    Create JWT token for authenticated user.
    """

    token_data = {
        "sub": str(user.id),
        "role": user.role.value,
    }

    return create_access_token(token_data)

def register_user(
    db: Session,
    data: RegisterRequest,
) -> User:
    """
    Register a new user.

    Approved admin invitations create ADMIN accounts.
    Normal registrations create CUSTOMER accounts.
    """

    existing_user = (
        db.query(User)
        .filter(
            User.email == data.email
        )
        .first()
    )

    if existing_user:
        raise ValueError(
            "Email already registered"
        )


    role = UserRole.CUSTOMER


    invitation = (
        db.query(AdminInvitation)
        .filter(
            AdminInvitation.email == data.email,
            AdminInvitation.status
            == AdminInvitationStatus.APPROVED,
            AdminInvitation.expires_at
            > datetime.utcnow(),
        )
        .order_by(
            AdminInvitation.approved_at.desc()
        )
        .first()
    )


    if invitation:
        role = UserRole.ADMIN


    user = User(
        name=data.name,
        email=data.email,
        phone=data.phone,
        password_hash=hash_password(
            data.password
        ),
        role=role,
        is_active=True,
    )


    db.add(user)


    if invitation:
        invitation.status = (
            AdminInvitationStatus.USED
        )


    db.commit()
    db.refresh(user)

    return user
