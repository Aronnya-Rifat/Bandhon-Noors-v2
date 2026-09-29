from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class AdminInvitationCreate(BaseModel):
    """
    Data required to invite a future admin.
    """

    email: EmailStr

    name: str | None = Field(
        default=None,
        max_length=100,
    )

    reason: str = Field(
        min_length=10,
        max_length=500,
    )


class AdminInvitationResponse(BaseModel):
    """
    Admin invitation response.
    """

    id: int

    email: str

    name: str | None

    reason: str

    requested_by: int

    approved_by: int | None

    status: str

    created_at: datetime

    approved_at: datetime | None

    expires_at: datetime | None

    class Config:
        from_attributes = True