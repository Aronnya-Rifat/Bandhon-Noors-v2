from datetime import datetime

from pydantic import BaseModel, Field


class CartItemCreate(BaseModel):
    """
    Add item to cart.
    """

    variant_id: int

    quantity: int = Field(
        default=1,
        ge=1,
    )



class CartItemUpdate(BaseModel):
    """
    Update cart item quantity.
    """

    quantity: int = Field(
        ge=1,
    )



class CartItemResponse(BaseModel):
    """
    Cart item response.
    """

    id: int

    cart_id: int

    variant_id: int

    quantity: int

    created_at: datetime

    updated_at: datetime


    class Config:
        from_attributes = True



class CartResponse(BaseModel):
    """
    Customer cart response.
    """

    id: int

    customer_id: int

    items: list[CartItemResponse] = []

    created_at: datetime

    updated_at: datetime


    class Config:
        from_attributes = True