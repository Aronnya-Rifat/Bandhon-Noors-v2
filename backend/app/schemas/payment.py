from datetime import datetime

from pydantic import BaseModel

from app.models.payment import (
    PaymentMethod,
    PaymentStatus,
)



class PaymentCreate(BaseModel):
    """
    Create payment request.
    """

    order_id: int

    payment_method: PaymentMethod



class PaymentResponse(BaseModel):
    """
    Payment response.
    """

    id: int

    order_id: int

    amount: float

    payment_method: PaymentMethod

    payment_status: PaymentStatus

    transaction_id: str | None

    created_at: datetime


    class Config:
        from_attributes = True