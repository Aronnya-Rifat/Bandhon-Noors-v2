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

from app.schemas.cart import (
    CartResponse,
    CartItemCreate,
    CartItemUpdate,
)

from app.services.cart_service import (
    add_cart_item,
    build_cart_response,
    get_cart,
    remove_cart_item,
    update_cart_item,
    clear_cart_items,
)


router = APIRouter(
    prefix="/cart",
    tags=["Cart"],
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



@router.get(
    "",
    response_model=CartResponse,
)
def view_cart(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get current customer cart.
    """

    require_customer(user)

    cart = get_cart(
        db=db,
        customer=user,
    )

    return build_cart_response(cart)



@router.post(
    "/items",
    response_model=CartResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_item(
    data: CartItemCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Add item to cart.
    """

    require_customer(user)

    try:
        add_cart_item(
            db=db,
            customer=user,
            data=data,
        )

        cart = get_cart(
            db=db,
            customer=user,
        )

        return build_cart_response(cart)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )



@router.put(
    "/items/{item_id}",
    response_model=CartResponse,
)
def update_item(
    item_id: int,
    data: CartItemUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update cart quantity.
    """

    require_customer(user)

    try:
        update_cart_item(
            db=db,
            customer=user,
            item_id=item_id,
            data=data,
        )

        cart = get_cart(
            db=db,
            customer=user,
        )

        return build_cart_response(cart)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )



@router.delete(
    "/items/{item_id}",
    response_model=CartResponse,
)
def delete_item(
    item_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Remove item from cart.
    """

    require_customer(user)

    try:
        remove_cart_item(
            db=db,
            customer=user,
            item_id=item_id,
        )

        cart = get_cart(
            db=db,
            customer=user,
        )

        return build_cart_response(cart)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )
        
@router.delete(
    "",
    response_model=CartResponse,
)
def clear_cart(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Remove every item from the current customer's cart.
    """

    require_customer(user)

    cart = clear_cart_items(
        db=db,
        customer=user,
    )

    return build_cart_response(cart)
