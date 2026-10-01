from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    HTTPException,
    Query,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user

from app.models.user import User, UserRole

from app.schemas.order import (
    CustomerOrderPage,
    OrderCreate,
    OrderResponse,
)

from app.services.order_service import (
    cancel_customer_order,
    create_order,
    get_customer_orders,
    get_customer_order,
)
from app.services.email_service import (
    send_new_order_notification_email,
    send_order_confirmation_email,
    send_order_status_email,
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
    background_tasks: BackgroundTasks,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create order from cart.
    """

    require_customer(user)

    try:
        order = create_order(
            db=db,
            customer=user,
            data=data,
        )

        item_summary = "\n".join(
            (
                f"- {item.product_name}"
                f"{f' ({item.variant_info})' if item.variant_info != 'Standard' else ''}"
                f" × {item.quantity}"
            )
            for item in order.items
        )

        background_tasks.add_task(
            send_order_confirmation_email,
            user.email,
            user.name,
            order.id,
            float(order.total_amount),
            item_summary,
        )

        background_tasks.add_task(
            send_new_order_notification_email,
            order.id,
            user.name,
            user.email,
            float(order.total_amount),
            item_summary,
        )

        return order

    except ValueError as error:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )

@router.get(
    "",
    response_model=CustomerOrderPage,
)
def list_orders(
    page: int = Query(
        default=1,
        ge=1,
    ),
    page_size: int = Query(
        default=20,
        ge=1,
        le=50,
    ),
    user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    """
    View one page of the customer's orders.
    """

    require_customer(user)

    return get_customer_orders(
        db=db,
        customer=user,
        page=page,
        page_size=page_size,
    )

@router.patch(
    "/{order_id}/cancel",
    response_model=OrderResponse,
)
def cancel_order(
    order_id: int,
    background_tasks: BackgroundTasks,
    user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
    
):
    """
    Cancel the authenticated customer's
    pending order.
    """

    require_customer(user)

    try:
        order = cancel_customer_order(
            db=db,
            customer=user,
            order_id=order_id,
        )

        background_tasks.add_task(
            send_order_status_email,
            user.email,
            user.name,
            order.id,
            order.status.value,
            order.courier_name,
            order.tracking_number,
        )

        return order

    except ValueError as error:
        db.rollback()

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),
            detail=str(error),
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
