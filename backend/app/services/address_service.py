from sqlalchemy.orm import Session

from app.models.address import CustomerAddress
from app.models.user import User

from app.schemas.address import (
    AddressCreate,
    AddressUpdate,
)



def clear_default_addresses(
    db: Session,
    customer_id: int,
):
    """
    Remove default status from
    customer's existing addresses.
    """

    (
        db.query(CustomerAddress)
        .filter(
            CustomerAddress.customer_id
            == customer_id,
            CustomerAddress.is_default
            == True,
        )
        .update(
            {
                "is_default": False
            }
        )
    )



def create_address(
    db: Session,
    customer: User,
    data: AddressCreate,
) -> CustomerAddress:
    """
    Create customer address.
    """


    if data.is_default:

        clear_default_addresses(
            db=db,
            customer_id=customer.id,
        )


    address = CustomerAddress(
        customer_id=customer.id,
        full_name=data.full_name,
        phone=data.phone,
        address_line=data.address_line,
        city=data.city,
        postal_code=data.postal_code,
        is_default=data.is_default,
    )


    db.add(address)

    db.commit()

    db.refresh(address)

    return address



def get_addresses(
    db: Session,
    customer: User,
) -> list[CustomerAddress]:
    """
    Get all customer addresses.
    """

    return (
        db.query(CustomerAddress)
        .filter(
            CustomerAddress.customer_id
            == customer.id
        )
        .order_by(
            CustomerAddress.is_default.desc()
        )
        .all()
    )



def get_address(
    db: Session,
    customer: User,
    address_id: int,
) -> CustomerAddress:
    """
    Get single customer address.
    """

    address = (
        db.query(CustomerAddress)
        .filter(
            CustomerAddress.id == address_id,
            CustomerAddress.customer_id
            == customer.id,
        )
        .first()
    )


    if address is None:
        raise ValueError(
            "Address not found"
        )


    return address



def update_address(
    db: Session,
    customer: User,
    address_id: int,
    data: AddressUpdate,
) -> CustomerAddress:
    """
    Update customer address.
    """

    address = get_address(
        db=db,
        customer=customer,
        address_id=address_id,
    )


    if data.is_default:

        clear_default_addresses(
            db=db,
            customer_id=customer.id,
        )


    update_data = (
        data.model_dump(
            exclude_unset=True
        )
    )


    for key, value in update_data.items():

        setattr(
            address,
            key,
            value,
        )


    db.commit()

    db.refresh(address)

    return address



def delete_address(
    db: Session,
    customer: User,
    address_id: int,
) -> CustomerAddress:
    """
    Delete customer address.
    """

    address = get_address(
        db=db,
        customer=customer,
        address_id=address_id,
    )


    db.delete(address)

    db.commit()

    return address