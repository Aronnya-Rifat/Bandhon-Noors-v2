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

from app.schemas.variant import (
    VariantCreate,
    VariantUpdate,
    VariantResponse,
)

from app.services.variant_service import (
    create_variant,
    get_variants,
    update_variant,
    delete_variant,
)


router = APIRouter(
    tags=["Product Variants"],
)


@router.post(
    "/admin/products/{product_id}/variants",
    response_model=VariantResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    product_id: int,
    data: VariantCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Create product variant.

    ADMIN and SUPER_ADMIN only.
    """

    try:
        return create_variant(
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
    "/products/{product_id}/variants",
    response_model=list[VariantResponse],
)
def list_variants(
    product_id: int,
    db: Session = Depends(get_db),
):
    """
    List variants of a product.
    """

    return get_variants(
        db=db,
        product_id=product_id,
    )



@router.put(
    "/admin/variants/{variant_id}",
    response_model=VariantResponse,
)
def update(
    variant_id: int,
    data: VariantUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Update variant.

    ADMIN and SUPER_ADMIN only.
    """

    try:
        return update_variant(
            db=db,
            variant_id=variant_id,
            data=data,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )



@router.delete(
    "/admin/variants/{variant_id}",
    response_model=VariantResponse,
)
def delete(
    variant_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Delete variant.

    ADMIN and SUPER_ADMIN only.
    """

    try:
        return delete_variant(
            db=db,
            variant_id=variant_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )