from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    status,
)
from app.core.config import settings
from app.core.rate_limit import (
    enforce_rate_limit,
)
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user
from app.models.user import User
from app.core.database import get_db

from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    RegisterRequest,
)
from app.schemas.user import (
    UserPasswordChange,
    UserProfileUpdate,
    UserResponse,
)
from app.schemas.user import UserResponse

from app.services.auth_service import (
    authenticate_user,
    change_user_password,
    create_user_token,
    register_user,
    update_user_profile,
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
    data: LoginRequest,
    http_request: Request,
    db: Session = Depends(get_db),
):
    """
    Authenticate user using email or phone.
    """
    enforce_rate_limit(
        http_request,
        scope="login",
        limit=settings.login_rate_limit,
        window_seconds=(
            settings
            .login_rate_window_seconds
        ),
    )
    user = authenticate_user(
        db=db,
        login=data.login,
        password=data.password,
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
    data: RegisterRequest,
    http_request: Request,
    db: Session = Depends(get_db),
):
    """
    Register a new user.

    Approved admin invitations create ADMIN accounts.
    Normal registrations create CUSTOMER accounts.
            """
    enforce_rate_limit(
        http_request,
        scope="registration",
        limit=(
            settings
            .registration_rate_limit
        ),
        window_seconds=(
            settings
            .registration_rate_window_seconds
        ),
    )
    try:
        return register_user(
            db=db,
            data=data,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )
        
@router.get(
    "/me",
    response_model=UserResponse,
)
def current_user_profile(
    user: User = Depends(get_current_user),
):
    """
    Return the authenticated user.

    Supports customers, admins,
    and super admins.
    """

    return user
@router.patch(
    "/me",
    response_model=UserResponse,
)
def update_current_user_profile(
    data: UserProfileUpdate,
    user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    try:
        return update_user_profile(
            db=db,
            user=user,
            data=data,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),
            detail=str(error),
        )


@router.post(
    "/me/password",
    response_model=UserResponse,
)
def update_current_user_password(
    data: UserPasswordChange,
    user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    try:
        return change_user_password(
            db=db,
            user=user,
            data=data,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),
            detail=str(error),
        )
