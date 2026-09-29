from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Numeric, String, Integer
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.models.base import Base


class ProductVariant(Base):
    """
    Stores individual purchasable versions of a product.

    Example:
    Product:
        Cotton Kurti

    Variants:
        Pink / M
        Blue / L
    """

    __tablename__ = "product_variants"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id"),
        nullable=False,
    )

    variant_code: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )

    color_theme: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    size: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    stock_quantity: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    low_stock_threshold: Mapped[int] = mapped_column(
        Integer,
        default=5,
        nullable=False,
    )
    additional_price: Mapped[float | None] = mapped_column(
        Numeric(10, 2),
        nullable=True,
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

    product = relationship(
        "Product",
        back_populates="variants",
    )