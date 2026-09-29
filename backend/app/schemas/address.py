from datetime import datetime

from pydantic import BaseModel



class AddressCreate(BaseModel):
    """
    Create customer address.
    """

    full_name: str

    phone: str

    address_line: str

    city: str

    postal_code: str | None = None

    is_default: bool = False



class AddressUpdate(BaseModel):
    """
    Update customer address.
    """

    full_name: str | None = None

    phone: str | None = None

    address_line: str | None = None

    city: str | None = None

    postal_code: str | None = None

    is_default: bool | None = None



class AddressResponse(BaseModel):
    """
    Customer address response.
    """

    id: int

    customer_id: int

    full_name: str

    phone: str

    address_line: str

    city: str

    postal_code: str | None

    is_default: bool

    created_at: datetime

    updated_at: datetime


    class Config:
        from_attributes = True