from datetime import datetime
from enum import Enum

from pydantic import BaseModel



class OrderStatus(str, Enum):
    """
    Order status values.
    """

    PENDING = "PENDING"

    CONFIRMED = "CONFIRMED"

    PROCESSING = "PROCESSING"

    SHIPPED = "SHIPPED"

    DELIVERED = "DELIVERED"

    CANCELLED = "CANCELLED"



class OrderCreate(BaseModel):
    """
    Create order from cart.
    """

    address_id: int



class OrderItemResponse(BaseModel):
    """
    Order item response.
    """

    id: int

    variant_id: int

    product_name: str

    variant_info: str

    quantity: int

    unit_price: float


    class Config:
        from_attributes = True



class OrderResponse(BaseModel):
    """
    Order response.
    """

    id: int

    customer_id: int

    status: OrderStatus

    total_amount: float

    shipping_address: str

    items: list[OrderItemResponse] = []


    created_at: datetime

    updated_at: datetime


    class Config:
        from_attributes = True