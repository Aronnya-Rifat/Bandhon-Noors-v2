from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user

from app.models.user import User, UserRole

from app.schemas.customer import CustomerProfileResponse


router = APIRouter(
    prefix="/customer",
    tags=["Customer"],
)


@router.get(
    "/me",
    response_model=CustomerProfileResponse,
)
def customer_profile(
    user: User = Depends(get_current_user),
):
    """
    Return current customer profile.
    """

    if user.role != UserRole.CUSTOMER:
        from fastapi import HTTPException, status

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Customer access required",
        )

    return user