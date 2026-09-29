from sqlalchemy.orm import Session

from app.models.cart import Cart, CartItem
from app.models.product_variant import ProductVariant
from app.models.user import User

from app.schemas.cart import (
    CartItemCreate,
    CartItemUpdate,
)



def get_or_create_cart(
    db: Session,
    customer: User,
) -> Cart:
    """
    Get customer's cart.

    Creates one if it does not exist.
    """

    cart = (
        db.query(Cart)
        .filter(
            Cart.customer_id == customer.id
        )
        .first()
    )

    if cart is None:
        cart = Cart(
            customer_id=customer.id,
        )

        db.add(cart)
        db.commit()
        db.refresh(cart)

    return cart



def get_cart(
    db: Session,
    customer: User,
) -> Cart:
    """
    Return customer cart.
    """

    return get_or_create_cart(
        db=db,
        customer=customer,
    )



def add_cart_item(
    db: Session,
    customer: User,
    data: CartItemCreate,
) -> CartItem:
    """
    Add product variant to cart.
    """

    cart = get_or_create_cart(
        db=db,
        customer=customer,
    )


    variant = (
        db.query(ProductVariant)
        .filter(
            ProductVariant.id
            == data.variant_id
        )
        .first()
    )

    if variant is None:
        raise ValueError(
            "Variant not found"
        )


    if variant.stock_quantity < data.quantity:
        raise ValueError(
            "Insufficient stock"
        )


    existing_item = (
        db.query(CartItem)
        .filter(
            CartItem.cart_id == cart.id,
            CartItem.variant_id
            == data.variant_id,
        )
        .first()
    )


    if existing_item:

        new_quantity = (
            existing_item.quantity
            + data.quantity
        )

        if (
            new_quantity
            > variant.stock_quantity
        ):
            raise ValueError(
                "Insufficient stock"
            )

        existing_item.quantity = (
            new_quantity
        )

        db.commit()
        db.refresh(existing_item)

        return existing_item



    item = CartItem(
        cart_id=cart.id,
        variant_id=data.variant_id,
        quantity=data.quantity,
    )


    db.add(item)
    db.commit()
    db.refresh(item)

    return item



def update_cart_item(
    db: Session,
    customer: User,
    item_id: int,
    data: CartItemUpdate,
) -> CartItem:
    """
    Update cart item quantity.
    """

    cart = get_or_create_cart(
        db=db,
        customer=customer,
    )


    item = (
        db.query(CartItem)
        .filter(
            CartItem.id == item_id,
            CartItem.cart_id == cart.id,
        )
        .first()
    )

    if item is None:
        raise ValueError(
            "Cart item not found"
        )


    variant = (
        db.query(ProductVariant)
        .filter(
            ProductVariant.id
            == item.variant_id
        )
        .first()
    )


    if variant.stock_quantity < data.quantity:
        raise ValueError(
            "Insufficient stock"
        )


    item.quantity = data.quantity

    db.commit()
    db.refresh(item)

    return item



def remove_cart_item(
    db: Session,
    customer: User,
    item_id: int,
) -> CartItem:
    """
    Remove item from cart.
    """

    cart = get_or_create_cart(
        db=db,
        customer=customer,
    )


    item = (
        db.query(CartItem)
        .filter(
            CartItem.id == item_id,
            CartItem.cart_id == cart.id,
        )
        .first()
    )


    if item is None:
        raise ValueError(
            "Cart item not found"
        )


    db.delete(item)
    db.commit()

    return item