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

from app.schemas.media import (
    ProductMediaCreate,
    ProductMediaResponse,
)

from app.services.media_service import (
    create_media,
    get_product_media,
    delete_media,
)


router = APIRouter(
    tags=["Product Media"],
)


@router.post(
    "/admin/products/{product_id}/media",
    response_model=ProductMediaResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_media(
    product_id: int,
    data: ProductMediaCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Add image/video to product.

    ADMIN and SUPER_ADMIN only.
    """

    try:
        return create_media(
            db=db,
            product_id=product_id,
            data=data,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.get(
    "/products/{product_id}/media",
    response_model=list[ProductMediaResponse],
)
def list_media(
    product_id: int,
    db: Session = Depends(get_db),
):
    """
    Get product images/videos.
    """

    return get_product_media(
        db=db,
        product_id=product_id,
    )


@router.delete(
    "/admin/media/{media_id}",
    response_model=ProductMediaResponse,
)
def remove_media(
    media_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Remove product media.

    ADMIN and SUPER_ADMIN only.
    """

    try:
        return delete_media(
            db=db,
            media_id=media_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )