"""add sslcommerz payment methods

Revision ID: 1f42a24d8672
Revises: de28cade4aab
Create Date: 2026-10-01 15:19:41.655362

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1f42a24d8672'
down_revision: Union[str, Sequence[str], None] = 'de28cade4aab'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "ALTER TYPE paymentmethod "
        "ADD VALUE IF NOT EXISTS 'BKASH'"
    )
    op.execute(
        "ALTER TYPE paymentmethod "
        "ADD VALUE IF NOT EXISTS 'NAGAD'"
    )
    op.execute(
        "ALTER TYPE paymentmethod "
        "ADD VALUE IF NOT EXISTS 'BANK'"
    )

def downgrade() -> None:
    """Downgrade database schema."""
    pass
