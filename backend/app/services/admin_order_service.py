from sqlalchemy.orm import Session

from app.models.order import (
    Order,
    OrderStatus,
)



def get_all_orders(
    db: Session,
) -> list[Order]:
    """
    Return all customer orders.
    """

    return (
        db.query(Order)
        .order_by(
            Order.created_at.desc()
        )
        .all()
    )



def get_order_by_id(
    db: Session,
    order_id: int,
) -> Order:
    """
    Return any order by id.
    """

    order = (
        db.query(Order)
        .filter(
            Order.id == order_id
        )
        .first()
    )


    if order is None:
        raise ValueError(
            "Order not found"
        )


    return order



def update_order_status(
    db: Session,
    order_id: int,
    status: OrderStatus,
) -> Order:
    """
    Update order status with transition validation.
    """

    order = get_order_by_id(
        db=db,
        order_id=order_id,
    )


    allowed_transitions = {

        OrderStatus.PENDING: [
            OrderStatus.CONFIRMED,
            OrderStatus.CANCELLED,
        ],

        OrderStatus.CONFIRMED: [
            OrderStatus.PROCESSING,
            OrderStatus.CANCELLED,
        ],

        OrderStatus.PROCESSING: [
            OrderStatus.SHIPPED,
        ],

        OrderStatus.SHIPPED: [
            OrderStatus.DELIVERED,
        ],

        OrderStatus.DELIVERED: [],

        OrderStatus.CANCELLED: [],
    }


    if status not in allowed_transitions[order.status]:

        raise ValueError(
            f"Cannot change order status "
            f"from {order.status.value} "
            f"to {status.value}"
        )


    order.status = status


    db.commit()
    db.refresh(order)

    return order