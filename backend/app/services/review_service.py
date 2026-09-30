from sqlalchemy.orm import Session

from app.models.order import (
    Order,
    OrderItem,
    OrderStatus,
)
from app.models.product import Product
from app.models.product_variant import ProductVariant
from app.models.review import ProductReview
from app.models.user import User
from app.schemas.review import ProductReviewCreate


def serialize_review(
    review: ProductReview,
    customer_name: str,
) -> dict:
    return {
        "id": review.id,
        "product_id": review.product_id,
        "customer_name": customer_name,
        "rating": review.rating,
        "comment": review.comment,
        "verified_purchase": True,
        "created_at": review.created_at,
    }


def get_product_reviews(
    db: Session,
    product_id: int,
) -> list[dict]:
    rows = (
        db.query(
            ProductReview,
            User.name,
        )
        .join(
            User,
            User.id == ProductReview.customer_id,
        )
        .filter(
            ProductReview.product_id == product_id,
            ProductReview.is_visible.is_(True),
        )
        .order_by(
            ProductReview.created_at.desc(),
        )
        .all()
    )

    return [
        serialize_review(
            review=review,
            customer_name=customer_name,
        )
        for review, customer_name in rows
    ]


def create_product_review(
    db: Session,
    customer: User,
    product_id: int,
    data: ProductReviewCreate,
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

    existing_review = (
        db.query(ProductReview)
        .filter(
            ProductReview.product_id == product_id,
            ProductReview.customer_id == customer.id,
        )
        .first()
    )

    if existing_review is not None:
        raise ValueError(
            "You have already reviewed this product"
        )

    delivered_order = (
        db.query(Order)
        .join(
            OrderItem,
            OrderItem.order_id == Order.id,
        )
        .join(
            ProductVariant,
            ProductVariant.id == OrderItem.variant_id,
        )
        .filter(
            Order.customer_id == customer.id,
            Order.status == OrderStatus.DELIVERED,
            ProductVariant.product_id == product_id,
        )
        .order_by(
            Order.created_at.desc(),
        )
        .first()
    )

    if delivered_order is None:
        raise ValueError(
            "Only customers with a delivered order can review this product"
        )

    review = ProductReview(
        product_id=product_id,
        customer_id=customer.id,
        order_id=delivered_order.id,
        rating=data.rating,
        comment=data.comment.strip(),
    )

    db.add(review)
    db.commit()
    db.refresh(review)

    return serialize_review(
        review=review,
        customer_name=customer.name,
    )
