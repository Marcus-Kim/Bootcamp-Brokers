from app.models import db, Transaction, environment, SCHEMA
from sqlalchemy.sql import text

def seed_transactions():
    transaction1 = Transaction(
        user_id=1,
        ticker_id='TSLA',
        shares=2,
    )
