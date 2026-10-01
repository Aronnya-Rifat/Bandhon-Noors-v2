from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from app.core.config import settings
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user

from app.models.user import User, UserRole

from app.schemas.payment import (
    PaymentCreate,
    PaymentOptionsResponse,
    PaymentResponse,
)
from app.services.payment_service import (
    create_payment,
    get_order_payment,
)


router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)



def require_customer(
    user: User,
):
    """
    Allow only customers.
    """

    if user.role != UserRole.CUSTOMER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Customer access required",
        )

    return user



@router.post(
    "",
    response_model=PaymentResponse,
    status_code=status.HTTP_201_CREATED,
)
def make_payment(
    data: PaymentCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create payment.

    CUSTOMER only.
    """

    require_customer(user)

    try:
        return create_payment(
            db=db,
            customer=user,
            data=data,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )

@router.get(
    "/options",
    response_model=PaymentOptionsResponse,
)
def payment_options():
    """
    Return currently configured checkout
    payment methods.

    Payment numbers are intentionally
    public because customers must see them
    to complete manual payment.
    """

    bkash_number = (
        settings.bkash_payment_number
    )

    nagad_number = (
        settings.nagad_payment_number
    )

    sslcommerz_enabled = bool(
        settings.sslcommerz_store_id
        and settings.sslcommerz_store_password
    )

    return {
        "cod_enabled": True,
        "bkash": {
            "enabled": bool(
                bkash_number
            ),
            "number": bkash_number,
            "instructions": (
                "Use Send Money and enter "
                "the exact order total. "
                "Keep the transaction ID."
            ),
        },
        "nagad": {
            "enabled": bool(
                nagad_number
            ),
            "number": nagad_number,
            "instructions": (
                "Use Send Money and enter "
                "the exact order total. "
                "Keep the transaction ID."
            ),
        },
        "sslcommerz_enabled": (
            sslcommerz_enabled
        ),
    }

@router.get(
    "/{order_id}",
    response_model=PaymentResponse,
)
def payment_details(
    order_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get payment for order.

    CUSTOMER only.
    """

    require_customer(user)

    try:
        return get_order_payment(
            db=db,
            customer=user,
            order_id=order_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )
