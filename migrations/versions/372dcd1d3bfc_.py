"""empty message

Revision ID: 372dcd1d3bfc
Revises: 
Create Date: 2023-03-12 13:40:45.791363

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


# revision identifiers, used by Alembic.
revision = '372dcd1d3bfc'
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
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=40), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('portfolios',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('profit_loss', sa.Float(asdecimal=True, decimal_return_scale=2), nullable=False),
    sa.Column('cash_balance', sa.Float(asdecimal=True, decimal_return_scale=2), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('transactions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('ticker_id', sa.String(length=10), nullable=False),
    sa.Column('shares', sa.Integer(), nullable=False),
    sa.Column('date', sa.Date(), nullable=False),
    sa.ForeignKeyConstraint(['ticker_id'], ['stocks.ticker'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('watchlists',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('list_name', sa.String(length=100), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('list_name')
    )
    op.create_table('chat_gpt',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('last_message_id', sa.String(length=255), nullable=True),
    sa.ForeignKeyConstraint(['last_message_id'], ['messages.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('portfolio_shares',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('portfolio_id', sa.Integer(), nullable=False),
    sa.Column('ticker_id', sa.String(length=10), nullable=False),
    sa.Column('shares', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['portfolio_id'], ['portfolios.id'], ),
    sa.ForeignKeyConstraint(['ticker_id'], ['stocks.ticker'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('portfolio_values',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('portfolio_id', sa.Integer(), nullable=False),
    sa.Column('current_balance', sa.Float(asdecimal=True, decimal_return_scale=2), nullable=False),
    sa.Column('date', sa.Date(), nullable=False),
    sa.ForeignKeyConstraint(['portfolio_id'], ['portfolios.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('watchlist_stocks',
    sa.Column('ticker_id', sa.String(length=10), nullable=False),
    sa.Column('watchlist_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['ticker_id'], ['stocks.ticker'], ),
    sa.ForeignKeyConstraint(['watchlist_id'], ['watchlists.id'], ),
    sa.PrimaryKeyConstraint('ticker_id', 'watchlist_id')
    )
    if environment == "production":
        op.execute(f"ALTER TABLE users SET SCHEMA {SCHEMA};")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('watchlist_stocks')
    op.drop_table('portfolio_values')
    op.drop_table('portfolio_shares')
    op.drop_table('chat_gpt')
    op.drop_table('watchlists')
    op.drop_table('transactions')
    op.drop_table('portfolios')
    op.drop_table('messages')
    op.drop_table('users')
    op.drop_table('stocks')
    # ### end Alembic commands ###