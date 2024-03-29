"""empty message

Revision ID: dbce79157783
Revises:
Create Date: 2023-03-17 12:53:49.926366

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


# revision identifiers, used by Alembic.
revision = 'dbce79157783'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('stocks',
    sa.Column('ticker', sa.String(length=10), nullable=False),
    sa.Column('company_name', sa.String(length=100), nullable=False),
    sa.Column('current_price', sa.Float(asdecimal=True, decimal_return_scale=2), nullable=False),
    sa.Column('daily_change', sa.Float(asdecimal=True, decimal_return_scale=2), nullable=False),
    sa.PrimaryKeyConstraint('ticker'),
    sa.UniqueConstraint('company_name'),
    sa.UniqueConstraint('ticker')
    )
    if environment == "production":
        op.execute(f"ALTER TABLE stocks SET SCHEMA {SCHEMA};")

    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=40), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    if environment == "production":
        op.execute(f"ALTER TABLE users SET SCHEMA {SCHEMA};")

    op.create_table('messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('message', sa.Text(), nullable=True),
    sa.Column('created_at', sa.Date(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    if environment == "production":
        op.execute(f"ALTER TABLE messages SET SCHEMA {SCHEMA};")

    op.create_table('portfolios',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('cash_balance', sa.Float(asdecimal=True, decimal_return_scale=2), nullable=False),
    sa.Column('initial_principle', sa.Float(asdecimal=True, decimal_return_scale=2), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    if environment == "production":
        op.execute(f"ALTER TABLE portfolios SET SCHEMA {SCHEMA};")

    op.create_table('transactions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('ticker_id', sa.String(length=10), nullable=False),
    sa.Column('shares', sa.Integer(), nullable=False),
    sa.Column('date', sa.Date(), nullable=False),
    sa.ForeignKeyConstraint(['ticker_id'], ['stocks.ticker'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    if environment == "production":
        op.execute(f"ALTER TABLE transactions SET SCHEMA {SCHEMA};")

    op.create_table('watchlists',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('list_name', sa.String(length=100), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('list_name')
    )
    if environment == "production":
        op.execute(f"ALTER TABLE watchlists SET SCHEMA {SCHEMA};")

    op.create_table('portfolio_shares',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('portfolio_id', sa.Integer(), nullable=False),
    sa.Column('ticker_id', sa.String(length=10), nullable=False),
    sa.Column('shares', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['portfolio_id'], ['portfolios.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['ticker_id'], ['stocks.ticker'], ),
    sa.PrimaryKeyConstraint('id')
    )
    if environment == "production":
        op.execute(f"ALTER TABLE portfolio_shares SET SCHEMA {SCHEMA};")

    op.create_table('portfolio_values',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('portfolio_id', sa.Integer(), nullable=False),
    sa.Column('current_balance', sa.Float(asdecimal=True, decimal_return_scale=2), nullable=False),
    sa.Column('date', sa.Date(), nullable=False),
    sa.ForeignKeyConstraint(['portfolio_id'], ['portfolios.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    if environment == "production":
        op.execute(f"ALTER TABLE portfolio_values SET SCHEMA {SCHEMA};")

    op.create_table('watchlist_stocks',
    sa.Column('ticker_id', sa.String(length=10), nullable=False),
    sa.Column('watchlist_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['ticker_id'], ['stocks.ticker'], ),
    sa.ForeignKeyConstraint(['watchlist_id'], ['watchlists.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('ticker_id', 'watchlist_id')
    )
    if environment == "production":
        op.execute(f"ALTER TABLE watchlist_stocks SET SCHEMA {SCHEMA};")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('watchlist_stocks')
    op.drop_table('portfolio_values')
    op.drop_table('portfolio_shares')
    op.drop_table('watchlists')
    op.drop_table('transactions')
    op.drop_table('portfolios')
    op.drop_table('messages')
    op.drop_table('users')
    op.drop_table('stocks')
    # ### end Alembic commands ###
