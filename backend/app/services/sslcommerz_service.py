from decimal import Decimal
import secrets

import httpx
from sqlalchemy.orm import Session, selectinload

from app.core.config import settings
from app.models.order import Order, OrderStatus
from app.models.payment import (
    PaymentMethod,
    PaymentStatus,
)
from app.models.user import User
from app.services.order_service import (
    cancel_customer_order,
)


PAYMENT_CHANNELS = {
    PaymentMethod.BKASH: "bkash",
    PaymentMethod.NAGAD: "nagad",
    PaymentMethod.BANK: "internetbank",
    PaymentMethod.CARD: (
        "visacard,mastercard,amexcard"
    ),
}


def get_gateway_base_url() -> str:
    if settings.sslcommerz_is_sandbox:
        return "https://sandbox.sslcommerz.com"

    return "https://securepay.sslcommerz.com"


def get_order(
    db: Session,
    order_id: int,
) -> Order:
    order = (
        db.query(Order)
        .options(
            selectinload(Order.items),
            selectinload(Order.payment),
        )
        .filter(Order.id == order_id)
        .first()
    )

    if order is None:
        raise ValueError("Order not found")

    return order


async def initiate_sslcommerz_payment(
    db: Session,
    customer: User,
    order_id: int,
) -> dict[str, str]:
    if (
        not settings.sslcommerz_store_id
        or not settings.sslcommerz_store_password
    ):
        raise ValueError(
            "SSLCOMMERZ is not configured"
        )

    order = get_order(
        db=db,
        order_id=order_id,
    )

    if order.customer_id != customer.id:
        raise ValueError("Order not found")

    if order.status != OrderStatus.PENDING:
        raise ValueError(
            "Only pending orders can be paid"
        )

    if order.payment is None:
        raise ValueError(
            "Payment record not found"
        )

    if (
        order.payment.payment_method
        == PaymentMethod.COD
    ):
        raise ValueError(
            "Cash on Delivery does not use "
            "the online payment gateway"
        )

    channel = PAYMENT_CHANNELS.get(
        order.payment.payment_method
    )

    if channel is None:
        raise ValueError(
            "Unsupported online payment method"
        )

    transaction_id = (
        f"BN-{order.id}-"
        f"{secrets.token_hex(6)}"
    )

    order.payment.transaction_id = (
        transaction_id
    )

    db.commit()

    product_names = ", ".join(
        item.product_name
        for item in order.items
    )[:250]

    quantity = sum(
        item.quantity
        for item in order.items
    )

    backend_url = (
        settings.backend_url.rstrip("/")
    )

    payload = {
        "store_id":
            settings.sslcommerz_store_id,
        "store_passwd":
            settings.sslcommerz_store_password,
        "total_amount":
            f"{Decimal(order.total_amount):.2f}",
        "currency": "BDT",
        "tran_id": transaction_id,
        "success_url": (
            f"{backend_url}/payments/"
            "sslcommerz/success"
        ),
        "fail_url": (
            f"{backend_url}/payments/"
            "sslcommerz/fail"
        ),
        "cancel_url": (
            f"{backend_url}/payments/"
            "sslcommerz/cancel"
        ),
        "ipn_url": (
            f"{backend_url}/payments/"
            "sslcommerz/ipn"
        ),
        "cus_name": customer.name,
        "cus_email": customer.email,
        "cus_phone": (
            customer.phone or "01700000000"
        ),
        "cus_add1":
            order.shipping_address[:250],
        "cus_city": "Bangladesh",
        "cus_country": "Bangladesh",
        "shipping_method": "YES",
        "ship_name": customer.name,
        "ship_add1":
            order.shipping_address[:250],
        "ship_city": "Bangladesh",
        "ship_country": "Bangladesh",
        "product_name":
            product_names or "Bandhon Noors Order",
        "product_category": "Fashion",
        "product_profile":
            "physical-goods",
        "num_of_item": str(quantity),
        "multi_card_name": channel,
        "value_a": str(order.id),
        "value_b": str(customer.id),
    }

    gateway_url = (
        f"{get_gateway_base_url()}"
        "/gwprocess/v4/api.php"
    )

    async with httpx.AsyncClient(
        timeout=30.0
    ) as client:
        response = await client.post(
            gateway_url,
            data=payload,
        )

    response.raise_for_status()
    result = response.json()

    if result.get("status") != "SUCCESS":
        raise ValueError(
            result.get(
                "failedreason",
                "Unable to start online payment",
            )
        )

    redirect_url = result.get(
        "GatewayPageURL"
    )

    if not redirect_url:
        raise ValueError(
            "Payment gateway URL was not returned"
        )

    return {
        "gateway_url": redirect_url,
        "transaction_id": transaction_id,
    }


async def validate_sslcommerz_payment(
    db: Session,
    validation_id: str,
    transaction_id: str,
) -> Order:
    if (
        not settings.sslcommerz_store_id
        or not settings.sslcommerz_store_password
    ):
        raise ValueError(
            "SSLCOMMERZ is not configured"
        )

    validation_url = (
        f"{get_gateway_base_url()}"
        "/validator/api/"
        "validationserverAPI.php"
    )

    params = {
        "val_id": validation_id,
        "store_id":
            settings.sslcommerz_store_id,
        "store_passwd":
            settings.sslcommerz_store_password,
        "format": "json",
    }

    async with httpx.AsyncClient(
        timeout=30.0
    ) as client:
        response = await client.get(
            validation_url,
            params=params,
        )

    response.raise_for_status()
    result = response.json()

    if result.get("status") not in {
        "VALID",
        "VALIDATED",
    }:
        raise ValueError(
            "Payment validation failed"
        )

    if result.get("tran_id") != transaction_id:
        raise ValueError(
            "Transaction reference does not match"
        )

    order = (
        db.query(Order)
        .options(
            selectinload(Order.payment),
        )
        .join(Order.payment)
        .filter(
            Order.payment.has(
                transaction_id=transaction_id
            )
        )
        .first()
    )

    if order is None or order.payment is None:
        raise ValueError(
            "Payment transaction not found"
        )

    received_amount = Decimal(
        str(result.get("amount", "0"))
    )

    expected_amount = Decimal(
        order.total_amount
    )

    if received_amount != expected_amount:
        raise ValueError(
            "Payment amount does not match"
        )

    order.payment.payment_status = (
        PaymentStatus.SUCCESS
    )

    order.status = OrderStatus.CONFIRMED

    db.commit()
    db.refresh(order)

    return order


def fail_sslcommerz_payment(
    db: Session,
    transaction_id: str,
) -> Order | None:
    order = (
        db.query(Order)
        .options(
            selectinload(Order.payment),
        )
        .join(Order.payment)
        .filter(
            Order.payment.has(
                transaction_id=transaction_id
            )
        )
        .first()
    )

    if order is None or order.payment is None:
        return None

    if (
        order.payment.payment_status
        != PaymentStatus.PENDING
    ):
        return order

    customer = (
        db.query(User)
        .filter(
            User.id == order.customer_id
        )
        .first()
    )

    if customer is None:
        raise ValueError(
            "Order customer not found"
        )

    return cancel_customer_order(
        db=db,
        customer=customer,
        order_id=order.id,
    )
