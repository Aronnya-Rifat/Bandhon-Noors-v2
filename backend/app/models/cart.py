from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship
from app.models.base import Base


class Cart(Base):
    """
    Customer shopping cart.
    """

    __tablename__ = "carts"


    id: Mapped[int] = mapped_column(
        primary_key=True,
    )


    customer_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        unique=True,
        nullable=False,
    )


    items = relationship(
        "CartItem",
        back_populates="cart",
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


class CartItem(Base):
    """
    Items inside customer cart.
    """

    __tablename__ = "cart_items"
    __table_args__ = (
        UniqueConstraint(
            "cart_id",
            "variant_id",
            name="uq_cart_item_variant",
        ),
    )

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )


    cart_id: Mapped[int] = mapped_column(
        ForeignKey("carts.id"),
        nullable=False,
    )


    variant_id: Mapped[int] = mapped_column(
        ForeignKey("product_variants.id"),
        nullable=False,
    )


    quantity: Mapped[int] = mapped_column(
        nullable=False,
        default=1,
    )


    cart = relationship(
        "Cart",
        back_populates="items",
    )
    variant = relationship(
        "ProductVariant",
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
