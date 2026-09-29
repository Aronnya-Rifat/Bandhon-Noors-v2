from datetime import datetime
from enum import Enum

from pydantic import BaseModel
from app.models.payment import (
    PaymentMethod,
)


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

class DeliveryArea(str, Enum):
    """
    Supported delivery areas.
    """

    DHAKA = "DHAKA"

    OUTSIDE = "OUTSIDE"

class OrderCreate(BaseModel):
    """
    Create order from cart.
    """

    address_id: int
    
    delivery_area: DeliveryArea
    payment_method: PaymentMethod = (
        PaymentMethod.COD
    )


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
    subtotal: float

    delivery_area: DeliveryArea

    delivery_charge: float
    
    total_amount: float

    shipping_address: str

    items: list[OrderItemResponse]


    created_at: datetime

    updated_at: datetime


    class Config:
        from_attributes = True
