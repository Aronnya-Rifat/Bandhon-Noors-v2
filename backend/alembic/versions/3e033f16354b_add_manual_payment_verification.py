"""add manual payment verification

Revision ID: 3e033f16354b
Revises: 1f42a24d8672
Create Date: 2026-10-01 15:55:10.362061

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3e033f16354b'
down_revision: Union[str, Sequence[str], None] = '1f42a24d8672'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "payments",
        sa.Column(
            "sender_number",
            sa.String(length=20),
            nullable=True,
        ),
    )

    op.add_column(
        "payments",
        sa.Column(
            "verified_by_id",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.add_column(
        "payments",
        sa.Column(
            "verified_at",
            sa.DateTime(),
            nullable=True,
        ),
    )

    op.add_column(
        "payments",
        sa.Column(
            "verification_note",
            sa.String(length=500),
            nullable=True,
        ),
    )

    op.create_foreign_key(
        "fk_payments_verified_by_id_users",
        "payments",
        "users",
        ["verified_by_id"],
        ["id"],
    )

    op.create_index(
        "ix_payments_transaction_id",
        "payments",
        ["transaction_id"],
        unique=True,
    )

def downgrade() -> None:
    op.drop_index(
        "ix_payments_transaction_id",
        table_name="payments",
    )

    op.drop_constraint(
        "fk_payments_verified_by_id_users",
        "payments",
        type_="foreignkey",
    )

    op.drop_column(
        "payments",
        "verification_note",
    )

    op.drop_column(
        "payments",
        "verified_at",
    )

    op.drop_column(
        "payments",
        "verified_by_id",
    )

    op.drop_column(
        "payments",
        "sender_number",
    )
