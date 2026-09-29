from sqlalchemy.orm import (
    Session,
    selectinload,
)

from app.models.order import (
    Order,
    OrderStatus,
)
from app.models.inventory import (
    InventoryTransaction,
    InventoryTransactionType,
)
from app.models.payment import (
    Payment,
    PaymentMethod,
    PaymentStatus,
)
from app.models.product_variant import ProductVariant
from app.models.user import User


def get_all_orders(
    db: Session,
) -> list[Order]:
    """
    Return all customer orders.
    """

    return (
        db.query(Order)
        .options(
            selectinload(
                Order.items
            ),
            selectinload(
                Order.payment
            ),
        )
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
        .options(
            selectinload(
                Order.items
            ),
            selectinload(
                Order.payment
            ),
        )
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
    admin: User,
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
    if status == OrderStatus.CANCELLED:
        for item in order.items:
            variant = (
                db.query(ProductVariant)
                .filter(
                    ProductVariant.id
                    == item.variant_id
                )
                .first()
            )

            if variant is None:
                raise ValueError(
                    f"Variant {item.variant_id} not found"
                )

            variant.stock_quantity += (
                item.quantity
            )

            db.add(
                InventoryTransaction(
                    variant_id=variant.id,
                    change_amount=item.quantity,
                    transaction_type=(
                        InventoryTransactionType.RETURN
                    ),
                    note=(
                        f"Stock returned from "
                        f"cancelled order #{order.id}"
                    ),
                    created_by=admin.id,
                )
            )
    payment = (
        db.query(Payment)
        .filter(
            Payment.order_id == order.id
        )
        .first()
    )

    if payment is not None:
        if (
            status ==
            OrderStatus.CANCELLED
            and payment.payment_status
            == PaymentStatus.PENDING
        ):
            payment.payment_status = (
                PaymentStatus.FAILED
            )

        if (
            status ==
            OrderStatus.DELIVERED
            and payment.payment_method
            == PaymentMethod.COD
            and payment.payment_status
            == PaymentStatus.PENDING
        ):
            payment.payment_status = (
                PaymentStatus.SUCCESS
            )
    order.status = status


    db.commit()
    db.refresh(order)

    return order
