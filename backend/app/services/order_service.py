from sqlalchemy.orm import Session

from app.models.cart import CartItem
from app.models.order import (
    Order,
    OrderItem,
    OrderStatus,
)
from app.models.product_variant import ProductVariant
from app.models.inventory import (
    InventoryTransaction,
    InventoryTransactionType,
)

from app.models.user import User
from app.models.address import CustomerAddress
from app.schemas.order import OrderCreate



def create_order(
    db: Session,
    customer: User,
    data: OrderCreate,
) -> Order:
    """
    Create order from customer cart.
    """


    cart_items = (
        db.query(CartItem)
        .filter(
            CartItem.cart_id.in_(
                db.query(CartItem.cart_id)
                .filter(
                    CartItem.cart_id.isnot(None)
                )
            )
        )
        .all()
    )


    customer_cart_items = [
        item
        for item in cart_items
        if item.cart.customer_id == customer.id
    ]


    if not customer_cart_items:
        raise ValueError(
            "Cart is empty"
        )


    total_amount = 0

    address = (
        db.query(CustomerAddress)
        .filter(
            CustomerAddress.id == data.address_id,
            CustomerAddress.customer_id == customer.id,
        )
        .first()
    )


    if address is None:
        raise ValueError(
            "Address not found"
        )


    shipping_snapshot = (
        f"{address.full_name}\n"
        f"{address.phone}\n"
        f"{address.address_line}\n"
        f"{address.city}\n"
        f"{address.postal_code or ''}"
    )

    order = Order(
        customer_id=customer.id,
        status=OrderStatus.PENDING,
        total_amount=0,
        shipping_address=shipping_snapshot,
    )

    db.add(order)
    db.flush()


    for item in customer_cart_items:

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
                "Variant not found"
            )


        if (
            variant.stock_quantity
            < item.quantity
        ):
            raise ValueError(
                "Insufficient stock"
            )


        price = (
            variant.product.price
            +
            (
                variant.additional_price
                or 0
            )
        )


        total_amount += (
            price * item.quantity
        )


        order_item = OrderItem(
            order_id=order.id,
            variant_id=variant.id,
            product_name=variant.product.name,
            variant_info=(
                f"{variant.color_theme} / "
                f"{variant.size}"
            ),
            quantity=item.quantity,
            unit_price=price,
        )


        db.add(order_item)


        variant.stock_quantity -= (
            item.quantity
        )


        transaction = InventoryTransaction(
            variant_id=variant.id,
            change_amount=-item.quantity,
            transaction_type=(
                InventoryTransactionType.ORDER
            ),
            note="Order created",
            created_by=customer.id,
        )


        db.add(transaction)


        db.delete(item)


    order.total_amount = total_amount


    db.commit()
    db.refresh(order)

    return order

def get_customer_orders(
    db: Session,
    customer: User,
) -> list[Order]:
    """
    Get all orders of a customer.
    """

    return (
        db.query(Order)
        .filter(
            Order.customer_id == customer.id
        )
        .order_by(
            Order.created_at.desc()
        )
        .all()
    )



def get_customer_order(
    db: Session,
    customer: User,
    order_id: int,
) -> Order:
    """
    Get a single customer order.
    """

    order = (
        db.query(Order)
        .filter(
            Order.id == order_id,
            Order.customer_id == customer.id,
        )
        .first()
    )


    if order is None:
        raise ValueError(
            "Order not found"
        )


    return order