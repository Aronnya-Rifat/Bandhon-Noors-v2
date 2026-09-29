from sqlalchemy.orm import Session

from sqlalchemy import func

from app.models.user import (
    User,
    UserRole,
)

from app.models.product import Product

from app.models.order import (
    Order,
    OrderStatus,
)

from app.models.product_variant import ProductVariant



def get_dashboard_stats(
    db: Session,
):
    """
    Return admin dashboard statistics.
    """


    total_customers = (
        db.query(User)
        .filter(
            User.role == UserRole.CUSTOMER
        )
        .count()
    )


    total_products = (
        db.query(Product)
        .count()
    )


    total_orders = (
        db.query(Order)
        .count()
    )


    pending_orders = (
        db.query(Order)
        .filter(
            Order.status
            == OrderStatus.PENDING
        )
        .count()
    )


    total_sales = (
        db.query(
            func.sum(
                Order.total_amount
            )
        )
        .filter(
            Order.status
            != OrderStatus.CANCELLED
        )
        .scalar()
    )


    low_stock_count = (
        db.query(ProductVariant)
        .filter(
            ProductVariant.stock_quantity
            <= ProductVariant.low_stock_threshold
        )
        .count()
    )


    return {
        "total_customers": total_customers,
        "total_products": total_products,
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "total_sales": total_sales or 0,
        "low_stock_count": low_stock_count,
    }