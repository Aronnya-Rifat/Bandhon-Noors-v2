from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    String,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

from app.models.base import Base



class CustomerAddress(Base):
    """
    Saved customer shipping address.
    """

    __tablename__ = "customer_addresses"


    id: Mapped[int] = mapped_column(
        primary_key=True,
    )


    customer_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )


    full_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )


    phone: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )


    address_line: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )


    city: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )


    postal_code: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )


    is_default: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )


    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )


    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )