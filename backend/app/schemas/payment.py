from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field

from pydantic import BaseModel

from app.models.payment import (
    PaymentMethod,
    PaymentStatus,
)

class ManualPaymentOption(BaseModel):
    enabled: bool

    number: str | None

    instructions: str


class PaymentOptionsResponse(BaseModel):
    cod_enabled: bool

    bkash: ManualPaymentOption

    nagad: ManualPaymentOption

    sslcommerz_enabled: bool

class PaymentCreate(BaseModel):
    """
    Create payment request.
    """

    order_id: int

    payment_method: PaymentMethod

class PaymentVerificationDecision(
    str,
    Enum,
):
    APPROVE = "APPROVE"
    REJECT = "REJECT"


class PaymentVerificationUpdate(
    BaseModel,
):
    decision: PaymentVerificationDecision

    note: str | None = Field(
        default=None,
        max_length=500,
    )

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
    sender_number: str | None

    verified_by_id: int | None

    verified_at: datetime | None

    verification_note: str | None
    created_at: datetime


    class Config:
        from_attributes = True
