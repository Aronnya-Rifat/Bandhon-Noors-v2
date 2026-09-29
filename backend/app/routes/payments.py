from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user

from app.models.user import User, UserRole

from app.schemas.payment import (
    PaymentCreate,
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