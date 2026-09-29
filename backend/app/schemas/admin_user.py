from pydantic import BaseModel, EmailStr, Field


class AdminCreateRequest(BaseModel):
    """
    Data required to create an admin account.
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


class AdminResponse(BaseModel):
    """
    Admin user response.
    """

    id: int
    name: str
    email: str
    phone: str | None
    role: str
    is_active: bool

    class Config:
        from_attributes = True