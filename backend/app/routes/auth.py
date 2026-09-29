from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    RegisterRequest,
)

from app.schemas.user import UserResponse

from app.services.auth_service import (
    authenticate_user,
    create_user_token,
    register_user,
)


router = APIRouter(
    prefix="",
    tags=["Authentication"],
)


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    """
    Authenticate user using email or phone.
    """

    user = authenticate_user(
        db=db,
        login=request.login,
        password=request.password,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_user_token(user)

    return TokenResponse(
        access_token=token,
    )


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):
    """
    Register a new user.

    Approved admin invitations create ADMIN accounts.
    Normal registrations create CUSTOMER accounts.
    """

    try:
        return register_user(
            db=db,
            data=request,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )