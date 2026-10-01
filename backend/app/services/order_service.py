from sqlalchemy.orm import (
    Session,
    selectinload,
)
from decimal import Decimal
from app.models.cart import Cart, CartItem
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
from app.models.payment import (
    Payment,
    PaymentMethod,
    PaymentStatus,
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
    
    customer_cart_items = (
        db.query(CartItem)
        .join(
            Cart,
            CartItem.cart_id == Cart.id,
        )
        .filter(
            Cart.customer_id == customer.id
        )
        .all()
    )


    if not customer_cart_items:
        raise ValueError(
            "Cart is empty"
        )


    subtotal = Decimal("0.00")

    delivery_charge = (
        Decimal("80.00")
        if data.delivery_area.value == "DHAKA"
        else Decimal("150.00")
    )

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
        subtotal=0,
        delivery_area=data.delivery_area.value,
        delivery_charge=delivery_charge,
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
            .with_for_update()
            .first()
        )


        if variant is None:
            raise ValueError(
                "Variant not found"
            )
        if not variant.product.is_active:
            raise ValueError(
                f"{variant.product.name} is no longer available"
            )

        if (
            variant.stock_quantity
            < item.quantity
        ):
            raise ValueError(
                f"Only {variant.stock_quantity} "
                f"unit(s) of {variant.product.name} "
                f"are currently available"
            )


        price = (
            variant.product.price
            +
            (
                variant.additional_price
                or 0
            )
        )


        subtotal += (
            price * item.quantity
        )


        order_item = OrderItem(
            order_id=order.id,
            variant_id=variant.id,
            product_name=variant.product.name,
            variant_info=(
                " / ".join(
                    value
                    for value in (
                        variant.color_theme,
                        variant.size,
                    )
                    if value
                )
                or "Standard"
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


    order.total_amount = (
        subtotal +
        delivery_charge
    )

    payment = Payment(
        order_id=order.id,
        amount=order.total_amount,
        payment_method=(
            data.payment_method
        ),
        payment_status=(
            PaymentStatus.PENDING
        ),
    )

    db.add(payment)

    db.commit()
    db.refresh(order)

    return order

def get_customer_orders(
    db: Session,
    customer: User,
    page: int = 1,
    page_size: int = 20,
) -> dict:
    """
    Return one page of the customer's orders.
    """

    orders_query = (
        db.query(Order)
        .filter(
            Order.customer_id
            == customer.id
        )
    )

    total = orders_query.count()

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

    orders = (
        orders_query
        .options(
            selectinload(
                Order.items
            ),
            selectinload(
                Order.payment
            ),
        )
        .order_by(
            Order.created_at.desc(),
            Order.id.desc(),
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

    return {
        "items": orders,
        "total": total,
        "page": safe_page,
        "page_size": page_size,
        "total_pages": total_pages,
    }



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
        .options(
            selectinload(
                Order.items
            ),
            selectinload(
                Order.payment
            ),
        )
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
def cancel_customer_order(
    db: Session,
    customer: User,
    order_id: int,
) -> Order:
    """
    Cancel a customer's pending order
    and restore its stock.
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
            Order.id == order_id,
            Order.customer_id
            == customer.id,
        )
        .first()
    )

    if order is None:
        raise ValueError(
            "Order not found"
        )

    if (
        order.status
        != OrderStatus.PENDING
    ):
        raise ValueError(
            "Only pending orders can be cancelled"
        )

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
                change_amount=(
                    item.quantity
                ),
                transaction_type=(
                    InventoryTransactionType
                    .RETURN
                ),
                note=(
                    f"Stock returned from "
                    f"customer-cancelled "
                    f"order #{order.id}"
                ),
                created_by=customer.id,
            )
        )

    if (
        order.payment is not None
        and order.payment.payment_status
        == PaymentStatus.PENDING
    ):
        order.payment.payment_status = (
            PaymentStatus.FAILED
        )

    order.status = (
        OrderStatus.CANCELLED
    )

    db.commit()
    db.refresh(order)

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
        .filter(
            Order.id == order.id
        )
        .first()
    )
