from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.models.base import Base


class Product(Base):
    """
    Main product information.

    Variants, stock, and media are stored separately.
    """

    __tablename__ = "products"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"),
        nullable=False,
    )

    product_code: Mapped[str] = mapped_column(
        String(80),
        unique=True,
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    price: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    weight: Mapped[float | None] = mapped_column(
        Numeric(10, 2),
        nullable=True,
    )

    size_chart: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    is_featured: Mapped[bool] = mapped_column(
            Boolean,
            default=False,
            nullable=False,
        )
    
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
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

    variants = relationship(
        "ProductVariant",
        back_populates="product",
    )


    media = relationship(
        "ProductMedia",
        back_populates="product",
    )

    category = relationship(
        "Category",
        back_populates="products",
    )
    
    
