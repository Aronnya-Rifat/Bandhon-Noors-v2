from sqlalchemy import (
    case,
    func,
    or_,
)
from sqlalchemy.orm import Session

from app.models.order import (
    Order,
    OrderStatus,
)
from app.models.user import (
    User,
    UserRole,
)


def get_admin_customers(
    db: Session,
    page: int = 1,
    page_size: int = 50,
    query: str | None = None,
) -> dict:
    """
    Return paginated customer summaries.
    """

    customer_query = (
        db.query(User)
        .filter(
            User.role == UserRole.CUSTOMER
        )
    )

    normalized_query = (
        query.strip()
        if query
        else ""
    )

    if normalized_query:
        search_text = (
            f"%{normalized_query}%"
        )

        customer_query = (
            customer_query.filter(
                or_(
                    User.name.ilike(
                        search_text
                    ),
                    User.email.ilike(
                        search_text
                    ),
                    User.phone.ilike(
                        search_text
                    ),
                )
            )
        )

    total = customer_query.count()

    total_pages = max(
        1,
        (
            total
            + page_size
            - 1
        )
        // page_size,
    )

    safe_page = min(
        page,
        total_pages,
    )

    customer_ids = [
        customer.id
        for customer in (
            customer_query
            .order_by(
                User.created_at.desc(),
                User.id.desc(),
            )
            .offset(
                (
                    safe_page - 1
                )
                * page_size
            )
            .limit(page_size)
            .all()
        )
    ]

    if not customer_ids:
        return {
            "items": [],
            "total": total,
            "page": safe_page,
            "page_size": page_size,
            "total_pages": total_pages,
        }

    rows = (
        db.query(
            User,
            func.count(
                Order.id
            ).label(
                "order_count"
            ),
            func.coalesce(
                func.sum(
                    case(
                        (
                            Order.status
                            == OrderStatus.DELIVERED,
                            Order.total_amount,
                        ),
                        else_=0,
                    )
                ),
                0,
            ).label(
                "total_spent"
            ),
        )
        .outerjoin(
            Order,
            Order.customer_id
            == User.id,
        )
        .filter(
            User.id.in_(
                customer_ids
            )
        )
        .group_by(
            User.id
        )
        .all()
    )

    rows_by_id = {
        user.id: {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "is_active": user.is_active,
            "order_count": int(
                order_count
            ),
            "total_spent": float(
                total_spent
            ),
            "created_at":
                user.created_at,
        }
        for (
            user,
            order_count,
            total_spent,
        ) in rows
    }

    items = [
        rows_by_id[customer_id]
        for customer_id in customer_ids
        if customer_id in rows_by_id
    ]

    return {
        "items": items,
        "total": total,
        "page": safe_page,
        "page_size": page_size,
        "total_pages": total_pages,
    }
