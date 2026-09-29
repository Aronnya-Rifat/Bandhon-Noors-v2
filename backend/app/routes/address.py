from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user

from app.models.user import User, UserRole

from app.schemas.address import (
    AddressCreate,
    AddressUpdate,
    AddressResponse,
)

from app.services.address_service import (
    create_address,
    get_addresses,
    update_address,
    delete_address,
)


router = APIRouter(
    prefix="/addresses",
    tags=["Customer Addresses"],
)



def require_customer(
    user: User,
):
    """
    Allow only customers.
    """

    if user.role != UserRole.CUSTOMER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Customer access required",
        )

    return user



@router.get(
    "",
    response_model=list[AddressResponse],
)
def list_addresses(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List customer's saved addresses.
    """

    require_customer(user)

    return get_addresses(
        db=db,
        customer=user,
    )



@router.post(
    "",
    response_model=AddressResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_address(
    data: AddressCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create customer address.
    """

    require_customer(user)

    return create_address(
        db=db,
        customer=user,
        data=data,
    )



@router.put(
    "/{address_id}",
    response_model=AddressResponse,
)
def edit_address(
    address_id: int,
    data: AddressUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update customer address.
    """

    require_customer(user)

    try:
        return update_address(
            db=db,
            customer=user,
            address_id=address_id,
            data=data,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )



@router.delete(
    "/{address_id}",
    response_model=AddressResponse,
)
def remove_address(
    address_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Delete customer address.
    """

    require_customer(user)

    try:
        return delete_address(
            db=db,
            customer=user,
            address_id=address_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )