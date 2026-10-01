from datetime import datetime

from pydantic import BaseModel, Field


class VariantCreate(BaseModel):
    """
    Create product variant.
    """

    variant_code: str = Field(
        min_length=2,
        max_length=100,
    )

    color_theme: str | None = Field(
        default=None,
        max_length=50,
    )

    size: str | None = Field(
        default=None,
        max_length=50,
    )

    stock_quantity: int = Field(
        default=0,
        ge=0,
    )

    low_stock_threshold: int = Field(
        default=5,
        ge=0,
    )

    additional_price: float | None = None



class VariantUpdate(BaseModel):
    """
    Update product variant.
    """

    color_theme: str | None = None

    size: str | None = None

    stock_quantity: int | None = Field(
        default=None,
        ge=0,
    )

    low_stock_threshold: int | None = Field(
        default=None,
        ge=0,
    )

    additional_price: float | None = None
    variant_code: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )


class VariantResponse(BaseModel):
    """
    Variant response.
    """

    id: int

    product_id: int

    variant_code: str

    color_theme: str | None

    size: str | None

    stock_quantity: int

    low_stock_threshold: int

    additional_price: float | None

    created_at: datetime

    updated_at: datetime


    class Config:
        from_attributes = True
