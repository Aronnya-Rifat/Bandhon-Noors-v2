from pydantic import BaseModel, Field


class CartItemCreate(BaseModel):
    """
    Add item to cart.
    """

    variant_id: int

    quantity: int = Field(
        default=1,
        ge=1,
    )



class CartItemUpdate(BaseModel):
    """
    Update cart item quantity.
    """

    quantity: int = Field(
        ge=1,
    )

class CartProductResponse(BaseModel):
    """
    Product snapshot displayed in the cart.
    """

    id: int

    product_code: str

    name: str

    price: float


class CartVariantResponse(BaseModel):
    """
    Selected product variant.
    """

    id: int

    variant_code: str

    color_theme: str | None

    size: str | None

    stock_quantity: int

    additional_price: float


class CartItemResponse(BaseModel):
    """
    Complete cart item response.
    """

    id: int

    quantity: int

    product: CartProductResponse

    variant: CartVariantResponse


class CartResponse(BaseModel):
    """
    Customer cart response.
    """

    id: int

    items: list[CartItemResponse]

    total_items: int

    subtotal: float

