from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    status,
    BackgroundTask,
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
    AuthenticationMessage,
    PasswordResetConfirm,
    PasswordResetRequest,
)
from app.services.email_service import (
    send_password_reset_email,
)
from app.services.password_reset_service import (
    create_password_reset_token,
    reset_user_password,
)
from app.schemas.user import (
    UserPasswordChange,
    UserProfileUpdate,
    UserResponse,
    UserPasswordChangeResponse,
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
@router.post(
    "/password-reset/request",
    response_model=AuthenticationMessage,
)
def request_password_reset(
    data: PasswordResetRequest,
    background_tasks: BackgroundTasks,
    http_request: Request,
    db: Session = Depends(get_db),
):
    enforce_rate_limit(
        http_request,
        scope="password-reset",
        limit=5,
        window_seconds=3600,
    )

    result = (
        create_password_reset_token(
            db=db,
            email=str(data.email),
        )
    )

    if result is not None:
        user, token = result

        background_tasks.add_task(
            send_password_reset_email,
            user.email,
            user.name,
            token,
        )

    return {
        "message": (
            "If that email is registered, "
            "a password reset link has been sent."
        ),
    }


@router.post(
    "/password-reset/confirm",
    response_model=AuthenticationMessage,
)
def confirm_password_reset(
    data: PasswordResetConfirm,
    http_request: Request,
    db: Session = Depends(get_db),
):
    enforce_rate_limit(
        http_request,
        scope="password-reset-confirm",
        limit=10,
        window_seconds=3600,
    )

    try:
        reset_user_password(
            db=db,
            raw_token=data.token,
            new_password=data.new_password,
        )

        return {
            "message": (
                "Password reset successfully. "
                "You can now log in."
            ),
        }

    except ValueError as error:
        db.rollback()

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),
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
    response_model=UserPasswordChangeResponse,
)
def update_current_user_password(
    data: UserPasswordChange,
    user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    try:
        updated_user = (
            change_user_password(
                db=db,
                user=user,
                data=data,
            )
        )

        replacement_token = (
            create_user_token(
                updated_user
            )
        )

        return {
            "user": updated_user,
            "access_token":
                replacement_token,
            "token_type": "bearer",
        }

    except ValueError as error:
        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),
            detail=str(error),
        )
