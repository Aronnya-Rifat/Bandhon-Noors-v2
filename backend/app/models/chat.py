from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import (
    DateTime,
    Enum,
    ForeignKey,
    String,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.models.base import Base


class ChatConversationStatus(
    str,
    PyEnum,
):
    OPEN = "OPEN"

    CLOSED = "CLOSED"


class ChatSenderType(
    str,
    PyEnum,
):
    CUSTOMER = "CUSTOMER"

    ADMIN = "ADMIN"

    ASSISTANT = "ASSISTANT"


class ChatConversation(Base):
    __tablename__ = (
        "chat_conversations"
    )

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    customer_id: Mapped[int] = (
        mapped_column(
            ForeignKey("users.id"),
            nullable=False,
            index=True,
        )
    )

    assigned_admin_id: Mapped[
        int | None
    ] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    status: Mapped[
        ChatConversationStatus
    ] = mapped_column(
        Enum(
            ChatConversationStatus
        ),
        default=(
            ChatConversationStatus.OPEN
        ),
        nullable=False,
    )

    created_at: Mapped[
        datetime
    ] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[
        datetime
    ] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    messages = relationship(
        "ChatMessage",
        back_populates="conversation",
        cascade=(
            "all, delete-orphan"
        ),
        order_by=(
            "ChatMessage.created_at"
        ),
    )


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    conversation_id: Mapped[int] = (
        mapped_column(
            ForeignKey(
                "chat_conversations.id"
            ),
            nullable=False,
            index=True,
        )
    )

    sender_id: Mapped[
        int | None
    ] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    sender_type: Mapped[
        ChatSenderType
    ] = mapped_column(
        Enum(ChatSenderType),
        nullable=False,
    )

    message: Mapped[str] = (
        mapped_column(
            String(1000),
            nullable=False,
        )
    )

    is_read: Mapped[bool] = (
        mapped_column(
            default=False,
            nullable=False,
        )
    )

    created_at: Mapped[
        datetime
    ] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    conversation = relationship(
        "ChatConversation",
        back_populates="messages",
    )
