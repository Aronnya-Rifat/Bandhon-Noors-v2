from pydantic import BaseModel


class AdminProfileResponse(BaseModel):
    """
    Response for authenticated admin profile.
    """

    id: int

    name: str

    email: str

    phone: str | None

    role: str

    is_active: bool

    class Config:
        from_attributes = True