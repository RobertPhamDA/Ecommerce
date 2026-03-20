"""add order model

Revision ID: d9a0c0e6b59a
Revises: 
Create Date: 2026-03-20 10:54:20.033226

"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = 'd9a0c0e6b59a'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table('orders',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('product_id', sa.Integer(), nullable=True),
    sa.Column('quantity', sa.Integer(), nullable=False),
    sa.Column('total_price', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('customer_name', sa.String(length=200), nullable=False),
    sa.Column('customer_phone', sa.String(length=50), nullable=False),
    sa.Column('customer_address', sa.Text(), nullable=False),
    sa.Column('status', sa.String(length=20), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='SET NULL'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_orders_product_id'), 'orders', ['product_id'], unique=False)
    op.create_index(op.f('ix_orders_user_id'), 'orders', ['user_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_orders_user_id'), table_name='orders')
    op.drop_index(op.f('ix_orders_product_id'), table_name='orders')
    op.drop_table('orders')
