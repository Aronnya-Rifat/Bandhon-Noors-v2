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
from app.schemas.wishlist import (
    WishlistItemCreate,
    WishlistResponse,
)
from app.services.wishlist_service import (
    add_wishlist_item,
    build_wishlist_response,
    remove_wishlist_item,
)


router = APIRouter(
    prefix="/wishlist",
    tags=["Wishlist"],
)


def require_customer(
    user: User,
) -> User:
    if user.role != UserRole.CUSTOMER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Customer access required",
        )

    return user


@router.get(
    "",
    response_model=WishlistResponse,
)
def view_wishlist(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_customer(user)

    return build_wishlist_response(
        db=db,
        customer=user,
    )


@router.post(
    "/items",
    response_model=WishlistResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_item(
    data: WishlistItemCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_customer(user)

    try:
        return add_wishlist_item(
            db=db,
            customer=user,
            product_id=data.product_id,
        )

    except ValueError as error:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )


@router.delete(
    "/items/{product_id}",
    response_model=WishlistResponse,
)
def remove_item(
    product_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_customer(user)

    return remove_wishlist_item(
        db=db,
        customer=user,
        product_id=product_id,
    )
