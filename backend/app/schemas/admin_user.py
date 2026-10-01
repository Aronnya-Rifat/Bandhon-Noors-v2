from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

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
        min_length=12,
        max_length=72,
    )

class AdminStatusUpdate(BaseModel):
    is_active: bool
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
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True
