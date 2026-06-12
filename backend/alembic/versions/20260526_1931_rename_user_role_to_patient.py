"""rename user role to patient

Revision ID: 41fc8c9bc894
Revises: 098add61d145
Create Date: 2026-05-26 19:31:49.456941

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '41fc8c9bc894'
down_revision: Union[str, None] = '098add61d145'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("UPDATE users SET role = 'patient' WHERE role = 'user'")


def downgrade() -> None:
    op.execute("UPDATE users SET role = 'user' WHERE role = 'patient'")
