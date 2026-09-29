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

from app.schemas.order import (
    OrderCreate,
    OrderResponse,
)

from app.services.order_service import (
    create_order,
)

from app.services.order_service import (
    create_order,
    get_customer_orders,
    get_customer_order,
)


router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
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
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED,
)
def place_order(
    data: OrderCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create order from cart.
    """

    require_customer(user)

    try:
        return create_order(
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
    "",
    response_model=list[OrderResponse],
)
def list_orders(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    View customer's orders.
    """

    require_customer(user)

    return get_customer_orders(
        db=db,
        customer=user,
    )



@router.get(
    "/{order_id}",
    response_model=OrderResponse,
)
def order_details(
    order_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    View single order.
    """

    require_customer(user)

    try:
        return get_customer_order(
            db=db,
            customer=user,
            order_id=order_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )