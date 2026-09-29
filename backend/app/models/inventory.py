from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class InventoryTransactionType(str, PyEnum):
    """
    Stock movement reasons.
    """

    STOCK_IN = "STOCK_IN"
    STOCK_OUT = "STOCK_OUT"
    ORDER = "ORDER"
    RETURN = "RETURN"
    ADJUSTMENT = "ADJUSTMENT"


class InventoryTransaction(Base):
    """
    Records every stock change.
    """

    __tablename__ = "inventory_transactions"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    variant_id: Mapped[int] = mapped_column(
        ForeignKey("product_variants.id"),
        nullable=False,
    )

    change_amount: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    transaction_type: Mapped[InventoryTransactionType] = mapped_column(
        Enum(InventoryTransactionType),
        nullable=False,
    )

    note: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    created_by: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )