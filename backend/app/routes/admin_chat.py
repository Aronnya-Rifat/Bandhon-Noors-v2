from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import (
    require_admin,
)
from app.models.user import User
from app.schemas.chat import (
    AdminChatSummary,
    ChatConversationResponse,
    ChatMessageCreate,
)
from app.services.chat_service import (
    close_conversation,
    get_admin_conversation,
    get_admin_conversations,
    send_admin_message,
)


router = APIRouter(
    prefix="/admin/chat",
    tags=["Admin Chat"],
)


@router.get(
    "",
    response_model=list[
        AdminChatSummary
    ],
)
def list_conversations(
    db: Session = Depends(get_db),
    admin: User = Depends(
        require_admin
    ),
):
    return get_admin_conversations(
        db=db,
    )


@router.get(
    "/{conversation_id}",
    response_model=(
        ChatConversationResponse
    ),
)
def conversation_details(
    conversation_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(
        require_admin
    ),
):
    try:
        return get_admin_conversation(
            db=db,
            conversation_id=(
                conversation_id
            ),
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        )


@router.post(
    "/{conversation_id}/messages",
    response_model=(
        ChatConversationResponse
    ),
)
def reply_to_conversation(
    conversation_id: int,
    data: ChatMessageCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(
        require_admin
    ),
):
    try:
        return send_admin_message(
            db=db,
            conversation_id=(
                conversation_id
            ),
            admin=admin,
            text=data.message,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        )


@router.patch(
    "/{conversation_id}/close",
    response_model=(
        ChatConversationResponse
    ),
)
def close_admin_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(
        require_admin
    ),
):
    try:
        return close_conversation(
            db=db,
            conversation_id=(
                conversation_id
            ),
            admin=admin,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        )
