from datetime import (
    datetime,
    timedelta,
)
from hashlib import sha256
import secrets

from sqlalchemy.orm import Session

from app.core.security import (
    hash_password,
    validate_password_strength,
)
from app.models.password_reset import (
    PasswordResetToken,
)
from app.models.user import (
    User,
    UserRole,
)


RESET_TOKEN_MINUTES = 30


def hash_reset_token(
    token: str,
) -> str:
    return sha256(
        token.encode("utf-8")
    ).hexdigest()


def create_password_reset_token(
    db: Session,
    email: str,
) -> tuple[
    User,
    str,
] | None:
    normalized_email = (
        email.strip().lower()
    )

    user = (
        db.query(User)
        .filter(
            User.email
            == normalized_email,
            User.is_active.is_(True),
        )
        .first()
    )

    if user is None:
        return None

    now = datetime.utcnow()

    (
        db.query(
            PasswordResetToken
        )
        .filter(
            PasswordResetToken.user_id
            == user.id,
            PasswordResetToken.used_at
            .is_(None),
        )
        .update(
            {
                "used_at": now,
            },
            synchronize_session=False,
        )
    )

    raw_token = (
        secrets.token_urlsafe(48)
    )

    reset_token = (
        PasswordResetToken(
            user_id=user.id,
            token_hash=(
                hash_reset_token(
                    raw_token
                )
            ),
            expires_at=(
                now
                + timedelta(
                    minutes=(
                        RESET_TOKEN_MINUTES
                    )
                )
            ),
        )
    )

    db.add(reset_token)
    db.commit()

    return (
        user,
        raw_token,
    )


def reset_user_password(
    db: Session,
    raw_token: str,
    new_password: str,
) -> User:
    now = datetime.utcnow()

    reset_token = (
        db.query(
            PasswordResetToken
        )
        .filter(
            PasswordResetToken.token_hash
            == hash_reset_token(
                raw_token
            ),
        )
        .with_for_update()
        .first()
    )

    if (
        reset_token is None
        or reset_token.used_at
        is not None
        or reset_token.expires_at
        <= now
    ):
        raise ValueError(
            "Reset link is invalid or has expired"
        )

    user = (
        db.query(User)
        .filter(
            User.id
            == reset_token.user_id,
            User.is_active.is_(True),
        )
        .with_for_update()
        .first()
    )

    if user is None:
        raise ValueError(
            "Reset link is invalid or has expired"
        )

    minimum_length = (
        12
        if user.role in (
            UserRole.ADMIN,
            UserRole.SUPER_ADMIN,
        )
        else 8
    )

    validate_password_strength(
        new_password,
        minimum_length=minimum_length,
    )

    user.password_hash = (
        hash_password(
            new_password
        )
    )

    user.must_change_password = False
    user.session_version += 1

    reset_token.used_at = now

    db.commit()
    db.refresh(user)

    return user
