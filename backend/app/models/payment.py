from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import (
    DateTime,
    Enum,
    ForeignKey,
    Numeric,
    String,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.models.base import Base



class PaymentMethod(str, PyEnum):
    """
    Available payment methods.
    """
    COD = "COD"
    BKASH = "BKASH"
    NAGAD = "NAGAD"
    BANK = "BANK"
    CARD = "CARD"

    # Retained for existing database records.
    MOBILE_BANKING = "MOBILE_BANKING"



class PaymentStatus(str, PyEnum):
    """
    Payment lifecycle.
    """

    PENDING = "PENDING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"



class Payment(Base):
    """
    Order payment record.
    """

    __tablename__ = "payments"


    id: Mapped[int] = mapped_column(
        primary_key=True,
    )


    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id"),
        unique=True,
        nullable=False,
    )
    order = relationship(
        "Order",
        back_populates="payment",
    )


    amount: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )


    payment_method: Mapped[PaymentMethod] = mapped_column(
        Enum(PaymentMethod),
        nullable=False,
    )


    payment_status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus),
        default=PaymentStatus.PENDING,
        nullable=False,
    )


    transaction_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )


    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )
