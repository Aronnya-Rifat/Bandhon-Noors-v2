from pydantic import BaseModel, EmailStr, Field

class LoginRequest(BaseModel):
    """
    User login request.

    login can be:
    - email address
    - phone number
    """

    login: str = Field(
        min_length=3,
        max_length=255,
    )

    password: str = Field(
        min_length=8,
        max_length=72,
    )


class TokenResponse(BaseModel):
    """
    JWT token response.
    """

    access_token: str

    token_type: str = "bearer"

class RegisterRequest(BaseModel):
    """
    User registration request.

    If email has an approved admin invitation,
    account becomes ADMIN.
    Otherwise CUSTOMER.
    """

    name: str = Field(
        min_length=2,
        max_length=100,
    )

    email: EmailStr

    phone: str | None = Field(
        default=None,
        max_length=20,
    )

    password: str = Field(
        min_length=8,
        max_length=72,
    )

class PasswordResetRequest(
    BaseModel,
):
    email: EmailStr


class PasswordResetConfirm(
    BaseModel,
):
    token: str = Field(
        min_length=32,
        max_length=255,
    )

    new_password: str = Field(
        min_length=8,
        max_length=72,
    )


class AuthenticationMessage(
    BaseModel,
):
    message: str
