"""add product comments

Revision ID: 29b9500956a4
Revises: d9a0c0e6b59a
Create Date: 2026-03-20 11:03:12.633847

"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = '29b9500956a4'
down_revision = 'd9a0c0e6b59a'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.add_column('comments', sa.Column('product_id', sa.Integer(), nullable=True))
    op.alter_column('comments', 'post_id', existing_type=sa.INTEGER(), nullable=True)
    op.create_index(op.f('ix_comments_product_id'), 'comments', ['product_id'], unique=False)
    op.create_foreign_key(None, 'comments', 'products', ['product_id'], ['id'], ondelete='CASCADE')

def downgrade() -> None:
    op.drop_constraint(None, 'comments', type_='foreignkey')
    op.drop_index(op.f('ix_comments_product_id'), table_name='comments')
    op.alter_column('comments', 'post_id', existing_type=sa.INTEGER(), nullable=False)
    op.drop_column('comments', 'product_id')
