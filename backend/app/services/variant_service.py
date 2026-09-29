from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.product_variant import ProductVariant

from app.schemas.variant import (
    VariantCreate,
    VariantUpdate,
)


def create_variant(
    db: Session,
    product_id: int,
    data: VariantCreate,
) -> ProductVariant:
    """
    Create a product variant.
    """

    product = (
        db.query(Product)
        .filter(
            Product.id == product_id
        )
        .first()
    )

    if product is None:
        raise ValueError(
            "Product not found"
        )


    existing = (
        db.query(ProductVariant)
        .filter(
            ProductVariant.variant_code
            == data.variant_code
        )
        .first()
    )

    if existing:
        raise ValueError(
            "Variant code already exists"
        )


    variant = ProductVariant(
        product_id=product_id,
        variant_code=data.variant_code,
        color_theme=data.color_theme,
        size=data.size,
        stock_quantity=data.stock_quantity,
        low_stock_threshold=data.low_stock_threshold,
        additional_price=data.additional_price,
    )


    db.add(variant)
    db.commit()
    db.refresh(variant)

    return variant



def get_variants(
    db: Session,
    product_id: int,
) -> list[ProductVariant]:
    """
    Get variants of a product.
    """

    return (
        db.query(ProductVariant)
        .filter(
            ProductVariant.product_id
            == product_id
        )
        .order_by(ProductVariant.id)
        .all()
    )



def get_variant(
    db: Session,
    variant_id: int,
) -> ProductVariant:
    """
    Get a single variant.
    """

    variant = (
        db.query(ProductVariant)
        .filter(
            ProductVariant.id
            == variant_id
        )
        .first()
    )

    if variant is None:
        raise ValueError(
            "Variant not found"
        )

    return variant



def update_variant(
    db: Session,
    variant_id: int,
    data: VariantUpdate,
) -> ProductVariant:
    """
    Update variant.
    """

    variant = get_variant(
        db,
        variant_id,
    )


    if data.color_theme is not None:
        variant.color_theme = (
            data.color_theme
        )


    if data.size is not None:
        variant.size = data.size


    if data.stock_quantity is not None:
        variant.stock_quantity = (
            data.stock_quantity
        )


    if data.low_stock_threshold is not None:
        variant.low_stock_threshold = (
            data.low_stock_threshold
        )


    if data.additional_price is not None:
        variant.additional_price = (
            data.additional_price
        )


    db.commit()
    db.refresh(variant)

    return variant



def delete_variant(
    db: Session,
    variant_id: int,
) -> ProductVariant:
    """
    Delete variant.

    Variants are currently removed permanently.
    Inventory history will protect stock records later.
    """

    variant = get_variant(
        db,
        variant_id,
    )

    db.delete(variant)
    db.commit()

    return variant