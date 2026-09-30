from math import ceil

from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.review import ProductReview
from app.models.user import User


def get_admin_reviews(
    db: Session,
    page: int,
    page_size: int,
    visibility: str | None,
) -> dict:
    query = (
        db.query(
            ProductReview,
            Product.name,
            User.name,
        )
        .join(
            Product,
            Product.id == ProductReview.product_id,
        )
        .join(
            User,
            User.id == ProductReview.customer_id,
        )
    )

    if visibility == "visible":
        query = query.filter(
            ProductReview.is_visible.is_(True),
        )

    if visibility == "hidden":
        query = query.filter(
            ProductReview.is_visible.is_(False),
        )

    total = query.count()
    total_pages = max(
        1,
        ceil(total / page_size),
    )

    page = min(
        page,
        total_pages,
    )

    rows = (
        query
        .order_by(
            ProductReview.created_at.desc(),
        )
        .offset(
            (page - 1) * page_size,
        )
        .limit(page_size)
        .all()
    )

    items = [
        {
            "id": review.id,
            "product_id": review.product_id,
            "product_name": product_name,
            "customer_id": review.customer_id,
            "customer_name": customer_name,
            "order_id": review.order_id,
            "rating": review.rating,
            "comment": review.comment,
            "is_visible": review.is_visible,
            "created_at": review.created_at,
        }
        for review, product_name, customer_name in rows
    ]

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


def update_review_visibility(
    db: Session,
    review_id: int,
    is_visible: bool,
) -> ProductReview:
    review = (
        db.query(ProductReview)
        .filter(
            ProductReview.id == review_id,
        )
        .first()
    )

    if review is None:
        raise ValueError(
            "Review not found"
        )

    review.is_visible = is_visible

    db.commit()
    db.refresh(review)

    return review
