from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import (
    DateTime,
    Enum,
    ForeignKey,
    Integer,
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
    sender_number: Mapped[
        str | None
    ] = mapped_column(
        String(20),
        nullable=True,
    )

    payment_status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus),
        default=PaymentStatus.PENDING,
        nullable=False,
    )


    transaction_id: Mapped[
        str | None
    ] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=True,
    )


    verified_by_id: Mapped[
        int | None
    ] = mapped_column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
    )


    verified_at: Mapped[
        datetime | None
    ] = mapped_column(
        DateTime,
        nullable=True,
    )


    verification_note: Mapped[
        str | None
    ] = mapped_column(
        String(500),
        nullable=True,
    )


    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )
