"""change description_images to longtext

Revision ID: 8f8031d96255
Revises: 197cadaa0621
Create Date: 2026-03-14 21:31:59.289704

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = '8f8031d96255'
down_revision: Union[str, Sequence[str], None] = '197cadaa0621'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column('tasks', 'description_images',
               existing_type=sa.Text(),
               type_=mysql.LONGTEXT(),
               existing_nullable=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('tasks', 'description_images',
               existing_type=mysql.LONGTEXT(),
               type_=sa.Text(),
               existing_nullable=True)
