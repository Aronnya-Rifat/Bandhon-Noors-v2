from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import (
    get_current_user,
    require_admin,
    require_super_admin,
)
from app.models.user import User
from app.schemas.admin_invitation import (
    AdminInvitationCreate,
    AdminInvitationResponse,
)
from app.services.admin_invitation_service import (
    create_admin_invitation,
    approve_admin_invitation,
    reject_admin_invitation,
    get_admin_invitations,
)


router = APIRouter(
    prefix="/admin/invitations",
    tags=["Admin Invitations"],
)


@router.post(
    "",
    response_model=AdminInvitationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_invitation(
    data: AdminInvitationCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Create an admin invitation.

    ADMIN and SUPER_ADMIN can access.
    """

    try:
        return create_admin_invitation(
            db=db,
            data=data,
            requested_by=admin,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )

@router.get(
    "",
    response_model=list[AdminInvitationResponse],
)
def list_invitations(
    db: Session = Depends(get_db),
    super_admin: User = Depends(require_super_admin),
):
    """
    View admin invitations.

    SUPER_ADMIN only.
    """

    return get_admin_invitations(
        db=db,
    )

@router.post(
    "/{invitation_id}/approve",
    response_model=AdminInvitationResponse,
)
def approve_invitation(
    invitation_id: int,
    db: Session = Depends(get_db),
    super_admin: User = Depends(require_super_admin),
):
    """
    Approve an admin invitation.

    SUPER_ADMIN only.
    """

    try:
        return approve_admin_invitation(
            db=db,
            invitation_id=invitation_id,
            approved_by=super_admin,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.post(
    "/{invitation_id}/reject",
    response_model=AdminInvitationResponse,
)
def reject_invitation(
    invitation_id: int,
    db: Session = Depends(get_db),
    super_admin: User = Depends(require_super_admin),
):
    """
    Reject an admin invitation.

    SUPER_ADMIN only.
    """

    try:
        return reject_admin_invitation(
            db=db,
            invitation_id=invitation_id,
            rejected_by=super_admin,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )