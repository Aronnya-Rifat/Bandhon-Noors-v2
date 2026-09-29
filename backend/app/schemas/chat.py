from datetime import datetime

from pydantic import (
    BaseModel,
    Field,
)

from app.models.chat import (
    ChatConversationStatus,
    ChatSenderType,
)


class ChatMessageCreate(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=1000,
    )


class ChatMessageResponse(BaseModel):
    id: int

    conversation_id: int

    sender_id: int | None

    sender_type: ChatSenderType

    message: str

    is_read: bool

    created_at: datetime

    class Config:
        from_attributes = True


class ChatConversationResponse(
    BaseModel
):
    id: int

    customer_id: int

    assigned_admin_id: (
        int | None
    )

    status: (
        ChatConversationStatus
    )

    messages: list[
        ChatMessageResponse
    ]

    created_at: datetime

    updated_at: datetime

    class Config:
        from_attributes = True


class AdminChatSummary(BaseModel):
    id: int

    customer_id: int

    customer_name: str

    customer_email: str

    status: (
        ChatConversationStatus
    )

    assigned_admin_id: (
        int | None
    )

    unread_count: int

    last_message: str | None

    last_message_at: (
        datetime | None
    )
