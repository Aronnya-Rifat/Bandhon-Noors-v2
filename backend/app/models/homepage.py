

from datetime import datetime

from sqlalchemy import (
    String,
    Boolean,
    Integer,
    DateTime,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

from app.models.base import Base



class HomepageContent(Base):

    __tablename__ = "homepage_contents"


    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )


    section_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )


    title: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )


    description: Mapped[str | None] = mapped_column(
        String(1000),
        nullable=True,
    )


    image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )


    button_text: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )


    button_link: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )


    display_order: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )


    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
    )


    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )


    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )
