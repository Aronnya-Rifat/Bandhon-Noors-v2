from datetime import datetime

from pydantic import BaseModel


class CustomerProfileResponse(BaseModel):
    """
    Customer profile response.
    """

    id: int

    name: str

    email: str

    phone: str | None

    created_at: datetime


    class Config:
        from_attributes = True