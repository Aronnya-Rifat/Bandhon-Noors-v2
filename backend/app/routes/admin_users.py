from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_super_admin
from app.models.user import User
from app.schemas.admin_user import (
    AdminCreateRequest,
    AdminResponse,
    AdminStatusUpdate,
)
from app.services.admin_user_service import (
    create_admin_user,
    get_admin_users,
    update_admin_status,
)


router = APIRouter(
    prefix="/admin/users",
    tags=["Admin Users"],
)

@router.get(
    "",
    response_model=list[AdminResponse],
)
def list_admin_users(
    db: Session = Depends(get_db),
    _: User = Depends(
        require_super_admin
    ),
):
    return get_admin_users(
        db=db,
    )


@router.patch(
    "/{admin_id}/status",
    response_model=AdminResponse,
)
def change_admin_status(
    admin_id: int,
    data: AdminStatusUpdate,
    db: Session = Depends(get_db),
    super_admin: User = Depends(
        require_super_admin
    ),
):
    try:
        return update_admin_status(
            db=db,
            admin_id=admin_id,
            is_active=data.is_active,
            current_user=super_admin,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )
@router.post(
    "",
    response_model=AdminResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_admin(
    data: AdminCreateRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    """
    Create an ADMIN user.

    Only SUPER_ADMIN can perform this action.
    """

    try:
        return create_admin_user(
            db=db,
            data=data,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )
