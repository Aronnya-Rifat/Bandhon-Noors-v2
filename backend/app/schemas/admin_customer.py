from datetime import datetime

from pydantic import BaseModel


class AdminCustomerResponse(BaseModel):
    id: int

    name: str

    email: str

    phone: str | None

    is_active: bool

    order_count: int

    total_spent: float

    created_at: datetime


class AdminCustomerPage(BaseModel):
    items: list[AdminCustomerResponse]

    total: int

    page: int

    page_size: int

    total_pages: int
