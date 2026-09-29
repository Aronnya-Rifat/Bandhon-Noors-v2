from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import (
    get_current_user,
)
from app.models.user import (
    User,
    UserRole,
)
from app.schemas.chat import (
    ChatConversationResponse,
    ChatMessageCreate,
)
from app.services.chat_service import (
    get_customer_conversation,
    send_customer_message,
)


router = APIRouter(
    prefix="/chat",
    tags=["Customer Chat"],
)


def require_customer(
    user: User,
) -> User:
    if (
        user.role
        != UserRole.CUSTOMER
    ):
        raise HTTPException(
            status_code=(
                status.HTTP_403_FORBIDDEN
            ),
            detail=(
                "Customer access required"
            ),
        )

    return user


@router.get(
    "",
    response_model=(
        ChatConversationResponse
    ),
)
def customer_chat(
    user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    customer = require_customer(
        user
    )

    return get_customer_conversation(
        db=db,
        customer=customer,
    )


@router.post(
    "/messages",
    response_model=(
        ChatConversationResponse
    ),
    status_code=(
        status.HTTP_201_CREATED
    ),
)
def create_customer_message(
    data: ChatMessageCreate,
    user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    customer = require_customer(
        user
    )

    return send_customer_message(
        db=db,
        customer=customer,
        text=data.message,
    )
