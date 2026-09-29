from datetime import datetime

from sqlalchemy.orm import Session

from app.models.admin_invitation import (
    AdminInvitation,
    AdminInvitationStatus,
)
from app.models.user import User


def create_admin_invitation(
    db: Session,
    data,
    requested_by: User,
) -> AdminInvitation:
    """
    Create an admin invitation.

    Only ADMIN users should access this.
    """

    existing_invitation = (
        db.query(AdminInvitation)
        .filter(
            AdminInvitation.email == data.email,
            AdminInvitation.status
            == AdminInvitationStatus.PENDING,
        )
        .first()
    )

    if existing_invitation:
        raise ValueError(
            "A pending invitation already exists for this email"
        )

    invitation = AdminInvitation(
        email=data.email,
        name=data.name,
        reason=data.reason,
        requested_by=requested_by.id,
        status=AdminInvitationStatus.PENDING,
    )

    db.add(invitation)
    db.commit()
    db.refresh(invitation)

    return invitation


def approve_admin_invitation(
    db: Session,
    invitation_id: int,
    approved_by: User,
) -> AdminInvitation:
    """
    Approve an admin invitation.

    Only SUPER_ADMIN should call this.
    """

    invitation = (
        db.query(AdminInvitation)
        .filter(
            AdminInvitation.id == invitation_id
        )
        .first()
    )

    if invitation is None:
        raise ValueError(
            "Invitation not found"
        )

    if invitation.status != AdminInvitationStatus.PENDING:
        raise ValueError(
            "Invitation already reviewed"
        )

    invitation.status = (
        AdminInvitationStatus.APPROVED
    )

    invitation.approved_by = approved_by.id

    invitation.approved_at = datetime.utcnow()

    db.commit()
    db.refresh(invitation)

    return invitation


def reject_admin_invitation(
    db: Session,
    invitation_id: int,
    rejected_by: User,
) -> AdminInvitation:
    """
    Reject an admin invitation.

    Only SUPER_ADMIN should call this.
    """

    invitation = (
        db.query(AdminInvitation)
        .filter(
            AdminInvitation.id == invitation_id
        )
        .first()
    )

    if invitation is None:
        raise ValueError(
            "Invitation not found"
        )

    if invitation.status != AdminInvitationStatus.PENDING:
        raise ValueError(
            "Invitation already reviewed"
        )

    invitation.status = (
        AdminInvitationStatus.REJECTED
    )

    invitation.approved_by = rejected_by.id

    invitation.approved_at = datetime.utcnow()

    db.commit()
    db.refresh(invitation)

    return invitation

def get_admin_invitations(
    db: Session,
) -> list[AdminInvitation]:
    """
    Get all admin invitations.

    Used by SUPER_ADMIN review panel.
    """

    return (
        db.query(AdminInvitation)
        .order_by(
            AdminInvitation.created_at.desc()
        )
        .all()
    )