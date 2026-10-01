"""classify legacy variant products

Revision ID: de28cade4aab
Revises: 44455a31365b
Create Date: 2026-10-01 14:15:18.966511

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'de28cade4aab'
down_revision: Union[str, Sequence[str], None] = '44455a31365b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Mark legacy products as variant products when they
    have multiple variants or a meaningful size/color.
    """

    op.execute(
        """
        UPDATE products
        SET has_variants = TRUE
        WHERE EXISTS (
            SELECT 1
            FROM product_variants
            WHERE product_variants.product_id = products.id
              AND (
                  product_variants.color_theme IS NOT NULL
                  OR product_variants.size IS NOT NULL
              )
        )
        OR (
            SELECT COUNT(*)
            FROM product_variants
            WHERE product_variants.product_id = products.id
        ) > 1
        """
    )


def downgrade() -> None:
    """
    Preserve the corrected product classification.
    """

    pass
