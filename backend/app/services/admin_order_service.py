from sqlalchemy.orm import (
    Session,
    selectinload,
)
from math import ceil

from sqlalchemy import or_
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
    page: int,
    page_size: int,
    query: str | None = None,
    order_status: (
        OrderStatus | None
    ) = None,
) -> dict:
    orders_query = (
        db.query(Order)
        .join(
            User,
            User.id
            == Order.customer_id,
        )
        .options(
            selectinload(
                Order.items
            ),
            selectinload(
                Order.payment
            ),
        )
    )

    if order_status is not None:
        orders_query = (
            orders_query.filter(
                Order.status
                == order_status
            )
        )

    clean_query = (
        query.strip()
        if query
        else ""
    )

    if clean_query:
        filters = [
            User.name.ilike(
                f"%{clean_query}%"
            ),
            User.email.ilike(
                f"%{clean_query}%"
            ),
            User.phone.ilike(
                f"%{clean_query}%"
            ),
        ]

        if clean_query.isdigit():
            filters.append(
                Order.id
                == int(clean_query)
            )

        orders_query = (
            orders_query.filter(
                or_(*filters)
            )
        )

    total = orders_query.count()

    total_pages = max(
        1,
        ceil(
            total / page_size
        ),
    )

    page = min(
        page,
        total_pages,
    )

    orders = (
        orders_query
        .order_by(
            Order.created_at.desc(),
            Order.id.desc(),
        )
        .offset(
            (page - 1)
            * page_size
        )
        .limit(page_size)
        .all()
    )

    customer_ids = {
        order.customer_id
        for order in orders
    }

    customers = {
        customer.id: customer
        for customer in (
            db.query(User)
            .filter(
                User.id.in_(
                    customer_ids
                )
            )
            .all()
        )
    }

    items = []

    for order in orders:
        customer = customers.get(
            order.customer_id
        )

        items.append(
            {
                "id": order.id,
                "customer_id":
                    order.customer_id,
                "customer_name": (
                    customer.name
                    if customer
                    else "Unknown customer"
                ),
                "customer_email": (
                    customer.email
                    if customer
                    else ""
                ),
                "status":
                    order.status,
                "subtotal":
                    order.subtotal,
                "delivery_area":
                    order.delivery_area,
                "delivery_charge":
                    order.delivery_charge,
                "total_amount":
                    order.total_amount,
                "shipping_address":
                    order.shipping_address,
                "items":
                    order.items,
                "payment":
                    order.payment,
                "created_at":
                    order.created_at,
                "updated_at":
                    order.updated_at,
            }
        )

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages":
            total_pages,
    }

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
                .with_for_update()
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
