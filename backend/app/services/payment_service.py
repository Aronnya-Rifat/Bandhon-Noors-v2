from sqlalchemy.orm import Session

from app.models.order import (
    Order,
    OrderStatus,
)

from app.models.payment import (
    Payment,
    PaymentStatus,
    PaymentMethod,
)

from app.models.user import User

from app.schemas.payment import PaymentCreate



def create_payment(
    db: Session,
    customer: User,
    data: PaymentCreate,
) -> Payment:
    """
    Create payment for customer order.
    """


    order = (
        db.query(Order)
        .filter(
            Order.id == data.order_id,
            Order.customer_id == customer.id,
        )
        .first()
    )


    if order is None:
        raise ValueError(
            "Order not found"
        )


    existing_payment = (
        db.query(Payment)
        .filter(
            Payment.order_id == order.id
        )
        .first()
    )


    if existing_payment:
        raise ValueError(
            "A payment record already exists for this order"
        )

    if (
        order.status
        == OrderStatus.CANCELLED
    ):
        raise ValueError(
            "Cannot create payment for a cancelled order"
        )


    status = PaymentStatus.PENDING


    # COD does not need gateway verification
    # Actual collection happens after delivery
    if data.payment_method == PaymentMethod.COD:
        status = PaymentStatus.PENDING


    payment = Payment(
        order_id=order.id,
        amount=order.total_amount,
        payment_method=data.payment_method,
        payment_status=status,
    )


    db.add(payment)

    db.commit()

    db.refresh(payment)

    return payment



def get_order_payment(
    db: Session,
    customer: User,
    order_id: int,
) -> Payment:
    """
    Get payment information for an order.
    """


    payment = (
        db.query(Payment)
        .join(Order)
        .filter(
            Payment.order_id == order_id,
            Order.customer_id == customer.id,
        )
        .first()
    )


    if payment is None:
        raise ValueError(
            "Payment not found"
        )


    return payment
