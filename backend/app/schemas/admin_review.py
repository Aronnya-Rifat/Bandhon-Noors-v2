from datetime import datetime

from pydantic import BaseModel


class AdminReviewResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    customer_id: int
    customer_name: str
    order_id: int
    rating: int
    comment: str
    is_visible: bool
    created_at: datetime


class AdminReviewPage(BaseModel):
    items: list[AdminReviewResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
