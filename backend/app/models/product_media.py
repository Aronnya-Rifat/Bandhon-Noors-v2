from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.models.base import Base


class MediaType(str, PyEnum):
    """
    Supported product media types.
    """

    IMAGE = "IMAGE"
    VIDEO = "VIDEO"


class ProductMedia(Base):
    """
    Stores images and videos linked to products.
    """

    __tablename__ = "product_media"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id"),
        nullable=False,
    )

    file_url: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )
    thumbnail_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )
    alt_text: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    media_type: Mapped[MediaType] = mapped_column(
        Enum(MediaType),
        nullable=False,
    )

    display_order: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    is_primary: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    product = relationship(
        "Product",
        back_populates="media",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )