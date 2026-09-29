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

from app.schemas.inventory import (
    InventoryCreate,
    InventoryResponse,
    InventoryVariantResponse,
)

from app.services.inventory_service import (
    create_inventory_transaction,
    get_inventory_history,
    get_low_stock_variants,
    get_inventory_variants
)


router = APIRouter(
    prefix="/admin/inventory",
    tags=["Inventory"],
)
@router.get(
    "/variants",
    response_model=list[
        InventoryVariantResponse
    ],
)
def inventory_variants(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Return all variants for inventory management.
    """

    return get_inventory_variants(
        db=db,
    )

@router.post(
    "",
    response_model=InventoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_transaction(
    data: InventoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Create inventory transaction.

    ADMIN and SUPER_ADMIN only.
    """

    try:
        return create_inventory_transaction(
            db=db,
            data=data,
            user=admin,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )



@router.get(
    "/{variant_id}/history",
    response_model=list[InventoryResponse],
)
def inventory_history(
    variant_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    View inventory history for a variant.
    """

    return get_inventory_history(
        db=db,
        variant_id=variant_id,
    )



@router.get(
    "/low-stock",
)
def low_stock(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Get variants below stock threshold.
    """

    variants = get_low_stock_variants(
        db=db,
    )

    return [
        {
            "variant_id": variant.id,
            "variant_code": variant.variant_code,
            "stock_quantity": variant.stock_quantity,
            "low_stock_threshold": variant.low_stock_threshold,
        }
        for variant in variants
    ]
