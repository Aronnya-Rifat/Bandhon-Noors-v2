from datetime import datetime

from pydantic import BaseModel, Field


class ProductReviewCreate(BaseModel):
    rating: int = Field(
        ge=1,
        le=5,
    )

    comment: str = Field(
        min_length=3,
        max_length=1000,
    )


class ProductReviewResponse(BaseModel):
    id: int
    product_id: int
    customer_name: str
    rating: int
    comment: str
    verified_purchase: bool
    created_at: datetime
