from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_super_admin
from app.models.user import User
from app.schemas.admin_user import (
    AdminCreateRequest,
    AdminResponse,
)
from app.services.admin_user_service import (
    create_admin_user,
)


router = APIRouter(
    prefix="/admin/users",
    tags=["Admin Users"],
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