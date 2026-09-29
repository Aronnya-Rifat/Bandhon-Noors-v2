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



class OrderStatus(str, PyEnum):
    """
    Order lifecycle.
    """

    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    PROCESSING = "PROCESSING"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"



class Order(Base):
    """
    Customer order.
    """

    __tablename__ = "orders"


    id: Mapped[int] = mapped_column(
        primary_key=True,
    )


    customer_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )


    status: Mapped[OrderStatus] = mapped_column(
        Enum(OrderStatus),
        default=OrderStatus.PENDING,
        nullable=False,
    )


    total_amount: Mapped[float] = mapped_column(
        Numeric(10,2),
        nullable=False,
    )


    shipping_address: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )


    items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
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

class OrderItem(Base):
    """
    Products inside an order.
    """

    __tablename__ = "order_items"


    id: Mapped[int] = mapped_column(
        primary_key=True,
    )


    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id"),
        nullable=False,
    )


    variant_id: Mapped[int] = mapped_column(
        ForeignKey("product_variants.id"),
        nullable=False,
    )


    product_name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )


    variant_info: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )


    quantity: Mapped[int] = mapped_column(
        nullable=False,
    )


    unit_price: Mapped[float] = mapped_column(
        Numeric(10,2),
        nullable=False,
    )


    order = relationship(
        "Order",
        back_populates="items",
    )