from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.product_media import (
    MediaType,
    ProductMedia,
)
from app.models.user import User
from app.models.wishlist import WishlistItem


def build_wishlist_response(
    db: Session,
    customer: User,
) -> dict:
    rows = (
        db.query(
            WishlistItem,
            Product,
        )
        .join(
            Product,
            Product.id == WishlistItem.product_id,
        )
        .filter(
            WishlistItem.customer_id == customer.id,
            Product.is_active.is_(True),
        )
        .order_by(
            WishlistItem.created_at.desc(),
        )
        .all()
    )

    items = []

    for wishlist_item, product in rows:
        media = (
            db.query(ProductMedia)
            .filter(
                ProductMedia.product_id == product.id,
                ProductMedia.media_type == MediaType.IMAGE,
            )
            .order_by(
                ProductMedia.is_primary.desc(),
                ProductMedia.display_order.asc(),
                ProductMedia.id.asc(),
            )
            .first()
        )

        image = "/logo.png"

        if media is not None:
            image = (
                media.thumbnail_url
                or media.file_url
            )

        items.append(
            {
                "id": wishlist_item.id,
                "product_id": product.id,
                "name": product.name,
                "price": float(product.price),
                "image": image,
            }
        )

    return {
        "items": items,
    }


def add_wishlist_item(
    db: Session,
    customer: User,
    product_id: int,
) -> dict:
    product = (
        db.query(Product)
        .filter(
            Product.id == product_id,
            Product.is_active.is_(True),
        )
        .first()
    )

    if product is None:
        raise ValueError(
            "Product not found"
        )

    existing_item = (
        db.query(WishlistItem)
        .filter(
            WishlistItem.customer_id == customer.id,
            WishlistItem.product_id == product_id,
        )
        .first()
    )

    if existing_item is None:
        db.add(
            WishlistItem(
                customer_id=customer.id,
                product_id=product_id,
            )
        )

        db.commit()

    return build_wishlist_response(
        db=db,
        customer=customer,
    )


def remove_wishlist_item(
    db: Session,
    customer: User,
    product_id: int,
) -> dict:
    item = (
        db.query(WishlistItem)
        .filter(
            WishlistItem.customer_id == customer.id,
            WishlistItem.product_id == product_id,
        )
        .first()
    )

    if item is not None:
        db.delete(item)
        db.commit()

    return build_wishlist_response(
        db=db,
        customer=customer,
    )
