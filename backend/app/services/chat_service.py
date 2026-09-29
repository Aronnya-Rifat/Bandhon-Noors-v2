from datetime import datetime


from sqlalchemy.orm import (
    Session,
    selectinload,
)

from app.models.chat import (
    ChatConversation,
    ChatConversationStatus,
    ChatMessage,
    ChatSenderType,
)
from app.models.user import User


WELCOME_MESSAGE = (
    "Hello! I’m the Bandhon Noors "
    "shopping assistant. Ask about "
    "delivery, payment, returns, "
    "products, or an existing order. "
    "An administrator can also reply "
    "to you here."
)


def get_assistant_reply(
    message: str,
) -> str:
    normalized = message.lower()

    if any(
        word in normalized
        for word in (
            "delivery",
            "shipping",
            "charge",
        )
    ):
        return (
            "Delivery costs ৳80 inside "
            "Dhaka and ৳150 outside "
            "Dhaka. Delivery time can "
            "vary by location and courier "
            "availability."
        )

    if any(
        word in normalized
        for word in (
            "payment",
            "cash",
            "cod",
        )
    ):
        return (
            "Cash on Delivery is currently "
            "available. Your payment remains "
            "pending until the order is "
            "delivered."
        )

    if any(
        word in normalized
        for word in (
            "return",
            "exchange",
            "damaged",
            "wrong item",
        )
    ):
        return (
            "Please keep the product unused, "
            "retain its packaging and labels, "
            "and contact support before "
            "sending it back."
        )

    if any(
        word in normalized
        for word in (
            "order",
            "status",
            "tracking",
        )
    ):
        return (
            "You can check your order from "
            "My Account → My Orders. An "
            "administrator can also help if "
            "you provide the order number."
        )

    if any(
        word in normalized
        for word in (
            "size",
            "measurement",
        )
    ):
        return (
            "Available sizes appear on each "
            "product page. Check the product’s "
            "size guide when one is provided."
        )

    return (
        "Thank you for your message. "
        "I could not answer that automatically, "
        "so an administrator can reply here."
    )


def get_customer_conversation(
    db: Session,
    customer: User,
) -> ChatConversation:
    conversation = (
        db.query(ChatConversation)
        .options(
            selectinload(
                ChatConversation.messages
            )
        )
        .filter(
            ChatConversation.customer_id
            == customer.id
        )
        .order_by(
            ChatConversation.created_at
            .desc()
        )
        .first()
    )

    if conversation is None:
        conversation = (
            ChatConversation(
                customer_id=customer.id,
                status=(
                    ChatConversationStatus
                    .OPEN
                ),
            )
        )

        db.add(conversation)
        db.flush()

        db.add(
            ChatMessage(
                conversation_id=(
                    conversation.id
                ),
                sender_id=None,
                sender_type=(
                    ChatSenderType
                    .ASSISTANT
                ),
                message=(
                    WELCOME_MESSAGE
                ),
                is_read=False,
            )
        )

        db.commit()

        conversation = (
            db.query(
                ChatConversation
            )
            .options(
                selectinload(
                    ChatConversation
                    .messages
                )
            )
            .filter(
                ChatConversation.id
                == conversation.id
            )
            .first()
        )

    for message in conversation.messages:
        if (
            message.sender_type
            == ChatSenderType.ADMIN
        ):
            message.is_read = True

    db.commit()

    return conversation


def send_customer_message(
    db: Session,
    customer: User,
    text: str,
) -> ChatConversation:
    conversation = (
        get_customer_conversation(
            db=db,
            customer=customer,
        )
    )

    if (
        conversation.status
        == ChatConversationStatus.CLOSED
    ):
        conversation.status = (
            ChatConversationStatus.OPEN
        )

    customer_message = ChatMessage(
        conversation_id=(
            conversation.id
        ),
        sender_id=customer.id,
        sender_type=(
            ChatSenderType.CUSTOMER
        ),
        message=text.strip(),
        is_read=False,
    )

    assistant_message = ChatMessage(
        conversation_id=(
            conversation.id
        ),
        sender_id=None,
        sender_type=(
            ChatSenderType.ASSISTANT
        ),
        message=get_assistant_reply(
            text
        ),
        is_read=False,
    )

    conversation.updated_at = (
        datetime.utcnow()
    )

    db.add(customer_message)
    db.add(assistant_message)

    db.commit()

    return get_customer_conversation(
        db=db,
        customer=customer,
    )


def get_admin_conversations(
    db: Session,
) -> list[dict]:
    conversations = (
        db.query(ChatConversation)
        .options(
            selectinload(
                ChatConversation.messages
            )
        )
        .order_by(
            ChatConversation.updated_at
            .desc()
        )
        .all()
    )

    customer_ids = {
        conversation.customer_id
        for conversation
        in conversations
    }

    customers = (
        db.query(User)
        .filter(
            User.id.in_(customer_ids)
        )
        .all()
        if customer_ids
        else []
    )

    customers_by_id = {
        customer.id: customer
        for customer in customers
    }

    results = []

    for conversation in conversations:
        customer = customers_by_id.get(
            conversation.customer_id
        )

        if customer is None:
            continue

        unread_count = sum(
            1
            for message
            in conversation.messages
            if (
                message.sender_type
                == ChatSenderType.CUSTOMER
                and not message.is_read
            )
        )

        last_message = (
            conversation.messages[-1]
            if conversation.messages
            else None
        )

        results.append(
            {
                "id": conversation.id,
                "customer_id":
                    customer.id,
                "customer_name":
                    customer.name,
                "customer_email":
                    customer.email,
                "status":
                    conversation.status,
                "assigned_admin_id":
                    conversation
                    .assigned_admin_id,
                "unread_count":
                    unread_count,
                "last_message": (
                    last_message.message
                    if last_message
                    else None
                ),
                "last_message_at": (
                    last_message.created_at
                    if last_message
                    else None
                ),
            }
        )

    return results


def get_admin_conversation(
    db: Session,
    conversation_id: int,
) -> ChatConversation:
    conversation = (
        db.query(ChatConversation)
        .options(
            selectinload(
                ChatConversation.messages
            )
        )
        .filter(
            ChatConversation.id
            == conversation_id
        )
        .first()
    )

    if conversation is None:
        raise ValueError(
            "Conversation not found"
        )

    for message in conversation.messages:
        if (
            message.sender_type
            == ChatSenderType.CUSTOMER
        ):
            message.is_read = True

    db.commit()

    return conversation


def send_admin_message(
    db: Session,
    conversation_id: int,
    admin: User,
    text: str,
) -> ChatConversation:
    conversation = (
        get_admin_conversation(
            db=db,
            conversation_id=(
                conversation_id
            ),
        )
    )

    conversation.status = (
        ChatConversationStatus.OPEN
    )

    conversation.assigned_admin_id = (
        admin.id
    )

    conversation.updated_at = (
        datetime.utcnow()
    )

    db.add(
        ChatMessage(
            conversation_id=(
                conversation.id
            ),
            sender_id=admin.id,
            sender_type=(
                ChatSenderType.ADMIN
            ),
            message=text.strip(),
            is_read=False,
        )
    )

    db.commit()

    return get_admin_conversation(
        db=db,
        conversation_id=(
            conversation.id
        ),
    )


def close_conversation(
    db: Session,
    conversation_id: int,
    admin: User,
) -> ChatConversation:
    conversation = (
        get_admin_conversation(
            db=db,
            conversation_id=(
                conversation_id
            ),
        )
    )

    conversation.status = (
        ChatConversationStatus.CLOSED
    )

    conversation.assigned_admin_id = (
        admin.id
    )

    conversation.updated_at = (
        datetime.utcnow()
    )

    db.commit()
    db.refresh(conversation)

    return conversation
