from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import (
    DateTime,
    Enum,
    ForeignKey,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class AdminInvitationStatus(str, PyEnum):
    """
    Status of an admin invitation.
    """

    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    USED = "USED"


class AdminInvitation(Base):
    """
    Stores invitations for creating admin accounts.

    Created by:
    - ADMIN

    Approved by:
    - SUPER_ADMIN
    """

    __tablename__ = "admin_invitations"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )

    name: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    reason: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    requested_by: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    approved_by: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    status: Mapped[AdminInvitationStatus] = mapped_column(
        Enum(AdminInvitationStatus),
        default=AdminInvitationStatus.PENDING,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    approved_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    expires_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )