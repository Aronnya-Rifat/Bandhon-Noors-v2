from pydantic import (
    BaseModel,
    EmailStr,
    Field,
)


class UserResponse(BaseModel):
    """
    Public user response.

    Used after registration and for user information.
    """

    id: int

    name: str

    email: str

    phone: str | None

    role: str

    is_active: bool


    class Config:
        from_attributes = True
class UserProfileUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    email: EmailStr | None = None

    phone: str | None = Field(
        default=None,
        max_length=20,
    )


class UserPasswordChange(BaseModel):
    current_password: str = Field(
        min_length=1,
        max_length=72,
    )

    new_password: str = Field(
        min_length=8,
        max_length=72,
    )
