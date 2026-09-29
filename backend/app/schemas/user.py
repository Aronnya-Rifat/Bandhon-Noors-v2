from pydantic import BaseModel


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