from datetime import datetime, timedelta, timezone
from app.core.config import settings
from jose import jwt
from passlib.context import CryptContext


SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm


password_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

def validate_password_strength(
    password: str,
    minimum_length: int = 8,
) -> None:
    if len(password) < minimum_length:
        raise ValueError(
            f"Password must contain at least "
            f"{minimum_length} characters"
        )

    if password.isspace():
        raise ValueError(
            "Password cannot contain only spaces"
        )
def hash_password(password: str) -> str:
    """
    Hash a plain password before storing it.
    """

    return password_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Compare entered password with stored hash.
    """

    return password_context.verify(
        plain_password,
        hashed_password,
    )


def create_access_token(
    data: dict,
    expires_minutes: int,
) -> str:
    """
    Generate a JWT access token
    with an explicit lifetime.
    """

    to_encode = data.copy()

    expire = (
        datetime.now(
            timezone.utc
        )
        + timedelta(
            minutes=expires_minutes
        )
    )

    to_encode.update(
        {
            "exp": expire,
        }
    )

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )
