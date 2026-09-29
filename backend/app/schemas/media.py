from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class MediaType(str, Enum):
    IMAGE = "IMAGE"
    VIDEO = "VIDEO"


class ProductMediaCreate(BaseModel):
    """
    Create product media record.
    """

    file_url: str = Field(
        max_length=500,
    )

    thumbnail_url: str | None = None

    alt_text: str | None = None

    media_type: MediaType

    display_order: int = 0

    is_primary: bool = False

    


class ProductMediaResponse(BaseModel):
    """
    Product media response.
    """

    id: int

    product_id: int

    file_url: str

    thumbnail_url: str | None

    alt_text: str | None

    media_type: MediaType

    display_order: int

    is_primary: bool

    created_at: datetime


    class Config:
        from_attributes = True