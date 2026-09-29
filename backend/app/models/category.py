from datetime import datetime

from sqlalchemy import Boolean, DateTime, String
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)
from sqlalchemy import ForeignKey
from app.models.base import Base


class Category(Base):
    """
    Product category model.

    Examples:
    - Baby
    - Woman
    - Men
    - Jute Products
    - Pearl Ornaments
    """

    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )
    parent_id: Mapped[int | None] = mapped_column(
        ForeignKey("categories.id"),
        nullable=True,
    )
    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )
    slug: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )
    description: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )
    image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
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
    products = relationship(
        "Product",
        back_populates="category",
    )
    parent = relationship(
        "Category",
        remote_side=[id],
        back_populates="children",
    )


    children = relationship(
        "Category",
        back_populates="parent",
    )
