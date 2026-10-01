from app.schemas.order import (
    OrderResponse,
)
from pydantic import BaseModel

class AdminOrderResponse(
    OrderResponse,
):
    customer_name: str
    customer_email: str


class AdminOrderPage(BaseModel):
    items: list[
        AdminOrderResponse
    ]

    total: int
    page: int
    page_size: int
    total_pages: int
