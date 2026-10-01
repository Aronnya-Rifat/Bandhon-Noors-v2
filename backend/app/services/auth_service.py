from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    verify_password,
)


from app.models.user import (
    User,
    UserRole,
)
from app.schemas.user import (
    UserPasswordChange,
    UserProfileUpdate,
)
from app.schemas.auth import RegisterRequest
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)

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
    login_value = login.strip()

    if "@" in login_value:
        login_value = (
            login_value.lower()
        )
    statement = select(User).where(
        or_(
            User.email == login_value,
            User.phone == login_value,
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
        .filter(
            User.email == email
        )
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

    user = User(
        name=data.name.strip(),
        email=email,
        phone=phone,
        password_hash=hash_password(
            data.password
        ),
        role=UserRole.CUSTOMER,
        is_active=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user
def update_user_profile(
    db: Session,
    user: User,
    data: UserProfileUpdate,
) -> User:
    """
    Update the authenticated user's
    basic profile information.
    """

    if data.name is not None:
        user.name = (
            data.name.strip()
        )

    if data.email is not None:
        email = (
            str(data.email)
            .strip()
            .lower()
        )

        existing_email = (
            db.query(User)
            .filter(
                User.email == email,
                User.id != user.id,
            )
            .first()
        )

        if existing_email:
            raise ValueError(
                "Email already registered"
            )

        user.email = email

    if (
        "phone"
        in data.model_fields_set
    ):
        phone = (
            data.phone.strip()
            if data.phone
            else None
        )

        if phone:
            existing_phone = (
                db.query(User)
                .filter(
                    User.phone == phone,
                    User.id != user.id,
                )
                .first()
            )

            if existing_phone:
                raise ValueError(
                    "Phone number already registered"
                )

        user.phone = phone

    db.commit()
    db.refresh(user)

    return user


def change_user_password(
    db: Session,
    user: User,
    data: UserPasswordChange,
) -> User:
    """
    Change the authenticated user's
    password.
    """

    if not verify_password(
        data.current_password,
        user.password_hash,
    ):
        raise ValueError(
            "Current password is incorrect"
        )

    if verify_password(
        data.new_password,
        user.password_hash,
    ):
        raise ValueError(
            "New password must be different"
        )

    user.password_hash = (
        hash_password(
            data.new_password
        )
    )

    db.commit()
    db.refresh(user)

    return user
