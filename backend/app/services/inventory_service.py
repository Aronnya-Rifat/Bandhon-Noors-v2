from sqlalchemy.orm import Session

from app.models.product_variant import ProductVariant
from app.models.inventory import (
    InventoryTransaction,
    InventoryTransactionType,
)

from app.models.user import User

from app.schemas.inventory import (
    InventoryCreate,
)


def create_inventory_transaction(
    db: Session,
    data: InventoryCreate,
    user: User,
) -> InventoryTransaction:
    """
    Create inventory change.
    """

    variant = (
        db.query(ProductVariant)
        .filter(
            ProductVariant.id
            == data.variant_id
        )
        .first()
    )

    if variant is None:
        raise ValueError(
            "Variant not found"
        )


    new_quantity = (
        variant.stock_quantity
        + data.change_amount
    )


    if new_quantity < 0:
        raise ValueError(
            "Insufficient stock"
        )


    variant.stock_quantity = (
        new_quantity
    )


    transaction = InventoryTransaction(
        variant_id=data.variant_id,
        change_amount=data.change_amount,
        transaction_type=data.transaction_type,
        note=data.note,
        created_by=user.id,
    )


    db.add(transaction)

    db.commit()

    db.refresh(transaction)

    return transaction



def get_inventory_history(
    db: Session,
    variant_id: int,
) -> list[InventoryTransaction]:
    """
    Return stock history for variant.
    """

    return (
        db.query(InventoryTransaction)
        .filter(
            InventoryTransaction.variant_id
            == variant_id
        )
        .order_by(
            InventoryTransaction.created_at.desc()
        )
        .all()
    )



def get_low_stock_variants(
    db: Session,
) -> list[ProductVariant]:
    """
    Return variants below threshold.
    """

    return (
        db.query(ProductVariant)
        .filter(
            ProductVariant.stock_quantity
            <= ProductVariant.low_stock_threshold
        )
        .all()
    )
    
    
def get_inventory_variants(
    db: Session,
) -> list[dict]:
    """
    Return every product variant with
    product information and stock levels.
    """

    variants = (
        db.query(ProductVariant)
        .order_by(
            ProductVariant.product_id,
            ProductVariant.id,
        )
        .all()
    )

    return [
        {
            "variant_id": variant.id,
            "product_id": (
                variant.product_id
            ),
            "product_name": (
                variant.product.name
            ),
            "variant_code": (
                variant.variant_code
            ),
            "color_theme": (
                variant.color_theme
            ),
            "size": variant.size,
            "stock_quantity": (
                variant.stock_quantity
            ),
            "low_stock_threshold": (
                variant.low_stock_threshold
            ),
        }
        for variant in variants
    ]
