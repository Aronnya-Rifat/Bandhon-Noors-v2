"""backfill standard variants for simple products

Revision ID: 44455a31365b
Revises: 08d208ad20b8
Create Date: 2026-10-01 14:10:49.426160

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '44455a31365b'
down_revision: Union[str, Sequence[str], None] = '08d208ad20b8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Give every legacy simple product an internal
    standard variant when it currently has no variant.
    """

    op.execute(
        """
        INSERT INTO product_variants (
            product_id,
            variant_code,
            color_theme,
            size,
            stock_quantity,
            low_stock_threshold,
            additional_price,
            created_at,
            updated_at
        )
        SELECT
            products.id,
            products.product_code || '-STD',
            NULL,
            NULL,
            0,
            5,
            NULL,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        FROM products
        WHERE products.has_variants = FALSE
          AND NOT EXISTS (
              SELECT 1
              FROM product_variants
              WHERE product_variants.product_id = products.id
          )
        """
    )


def downgrade() -> None:
    """
    Preserve product inventory during downgrade.

    Automatically deleting variants could destroy stock
    and order references, so this data migration is not reversed.
    """

    pass
