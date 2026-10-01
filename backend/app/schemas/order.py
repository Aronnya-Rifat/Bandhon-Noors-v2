from datetime import datetime
from enum import Enum

from pydantic import (
    BaseModel,
    field_validator,
    model_validator,
)
from app.models.payment import (
    PaymentMethod,
)
from app.schemas.payment import (
    PaymentResponse,
)


class OrderStatus(str, Enum):
    """
    Order status values.
    """

    PENDING = "PENDING"

    CONFIRMED = "CONFIRMED"

    PROCESSING = "PROCESSING"

    SHIPPED = "SHIPPED"

    DELIVERED = "DELIVERED"

    CANCELLED = "CANCELLED"

class DeliveryArea(str, Enum):
    """
    Supported delivery areas.
    """

    DHAKA = "DHAKA"

    OUTSIDE = "OUTSIDE"

class OrderCreate(BaseModel):
    """
    Create an order from the customer's cart.
    """

    address_id: int

    delivery_area: DeliveryArea

    payment_method: PaymentMethod = (
        PaymentMethod.COD
    )

    sender_number: str | None = None

    transaction_id: str | None = None


    @field_validator(
        "sender_number",
        "transaction_id",
        mode="before",
    )
    @classmethod
    def normalize_optional_text(
        cls,
        value: object,
    ) -> object:
        if not isinstance(value, str):
            return value

        normalized = value.strip()

        return normalized or None


    @model_validator(mode="after")
    def validate_payment_details(
        self,
    ):
        manual_methods = {
            PaymentMethod.BKASH,
            PaymentMethod.NAGAD,
        }

        if (
            self.payment_method
            not in manual_methods
        ):
            self.sender_number = None
            self.transaction_id = None

            return self

        if not self.sender_number:
            raise ValueError(
                "Sender number is required "
                "for manual payment"
            )

        normalized_number = (
            self.sender_number
            .replace(" ", "")
            .replace("-", "")
        )

        if normalized_number.startswith(
            "+88"
        ):
            normalized_number = (
                normalized_number[3:]
            )
        elif normalized_number.startswith(
            "88"
        ):
            normalized_number = (
                normalized_number[2:]
            )

        if (
            len(normalized_number) != 11
            or not normalized_number.startswith(
                "01"
            )
            or not normalized_number.isdigit()
        ):
            raise ValueError(
                "Enter a valid Bangladeshi "
                "mobile number"
            )

        if not self.transaction_id:
            raise ValueError(
                "Transaction ID is required "
                "for manual payment"
            )

        normalized_transaction_id = (
            self.transaction_id
            .replace(" ", "")
            .upper()
        )

        if (
            len(normalized_transaction_id)
            < 6
            or len(normalized_transaction_id)
            > 50
            or not normalized_transaction_id
            .isalnum()
        ):
            raise ValueError(
                "Enter a valid transaction ID"
            )

        self.sender_number = (
            normalized_number
        )

        self.transaction_id = (
            normalized_transaction_id
        )

        return self


class OrderItemResponse(BaseModel):
    """
    Order item response.
    """

    id: int

    variant_id: int

    product_name: str

    variant_info: str

    quantity: int

    unit_price: float


    class Config:
        from_attributes = True



class OrderResponse(BaseModel):
    """
    Order response.
    """

    id: int

    customer_id: int

    status: OrderStatus
    subtotal: float

    delivery_area: DeliveryArea

    delivery_charge: float
    
    total_amount: float

    shipping_address: str
    
    courier_name: str | None = None
    tracking_number: str | None = None

    items: list[OrderItemResponse]

    payment: PaymentResponse | None = None

    created_at: datetime

    updated_at: datetime


    class Config:
        from_attributes = True
class CustomerOrderPage(BaseModel):
    """
    Paginated customer order response.
    """

    items: list[OrderResponse]

    total: int

    page: int

    page_size: int

    total_pages: int
