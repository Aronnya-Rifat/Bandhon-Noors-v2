from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin

from app.models.user import User

from app.models.order import OrderStatus

from app.schemas.order import (
    OrderResponse,
)

from app.services.admin_order_service import (
    get_all_orders,
    get_order_by_id,
    update_order_status,
)


router = APIRouter(
    prefix="/admin/orders",
    tags=["Admin Orders"],
)



@router.get(
    "",
    response_model=list[OrderResponse],
)
def list_orders(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    View all customer orders.

    ADMIN and SUPER_ADMIN only.
    """

    return get_all_orders(
        db=db,
    )



@router.get(
    "/{order_id}",
    response_model=OrderResponse,
)
def order_details(
    order_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    View order details.
    """

    try:
        return get_order_by_id(
            db=db,
            order_id=order_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )



@router.patch(
    "/{order_id}/status",
    response_model=OrderResponse,
)
def change_status(
    order_id: int,
    new_status: OrderStatus,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Update order status.

    ADMIN and SUPER_ADMIN only.
    """

    try:
        return update_order_status(
            db=db,
            order_id=order_id,
            status=new_status,
            admin=admin,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )
