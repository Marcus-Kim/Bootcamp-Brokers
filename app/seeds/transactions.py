from app.models import db, Transaction, environment, SCHEMA
from sqlalchemy.sql import text


# Adds demo transactions, you can add other transactions here if you want
def seed_transactions():
    transactions = [
        {'user_id': 1, 'ticker_id': 'TSLA', 'shares': 2},
        {'user_id': 1, 'ticker_id': 'TSLA', 'shares': -1},
        {'user_id': 1, 'ticker_id': 'TSLA', 'shares': 2},
        {'user_id': 1, 'ticker_id': 'TSLA', 'shares': -1},
        {'user_id': 1, 'ticker_id': 'TSLA', 'shares': 1},
        {'user_id': 1, 'ticker_id': 'AAPL', 'shares': 4},
        {'user_id': 1, 'ticker_id': 'AAPL', 'shares': -2},
        {'user_id': 1, 'ticker_id': 'GOOG', 'shares': 2},
        {'user_id': 1, 'ticker_id': 'AMZN', 'shares': 3},
        {'user_id': 2, 'ticker_id': 'AMZN', 'shares': -2},
        {'user_id': 2, 'ticker_id': 'AMZN', 'shares': 2},
        {'user_id': 2, 'ticker_id': 'AMZN', 'shares': 1},
        {'user_id': 2, 'ticker_id': 'AAPL', 'shares': 5},
        {'user_id': 2, 'ticker_id': 'AAPL', 'shares': -3},
        {'user_id': 2, 'ticker_id': 'AAPL', 'shares': -1},
        {'user_id': 2, 'ticker_id': 'TSLA', 'shares': 3},
        {'user_id': 2, 'ticker_id': 'TSLA', 'shares': -2},
        {'user_id': 2, 'ticker_id': 'GOOG', 'shares': 1},
        {'user_id': 2, 'ticker_id': 'GOOG', 'shares': 1},
        {'user_id': 3, 'ticker_id': 'AAPL', 'shares': 2},
        {'user_id': 3, 'ticker_id': 'TSLA', 'shares': 4},
        {'user_id': 3, 'ticker_id': 'TSLA', 'shares': -1},
        {'user_id': 3, 'ticker_id': 'GOOG', 'shares': 1},
        {'user_id': 3, 'ticker_id': 'GOOG', 'shares': 2},
        {'user_id': 3, 'ticker_id': 'AMZN', 'shares': 3},
        {'user_id': 3, 'ticker_id': 'AMZN', 'shares': -2},
    ]
    
    for transaction in transactions:
        db.session.add(Transaction(
            user_id=transaction['user_id'],
            ticker_id=transaction['ticker_id'],
            shares=transaction['shares']
        ))
    
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the transactions table. SQLAlchemy
# doesn't have a built in function to do this. With postgres in production
# TRUNCATE removes all the data from the table, and RESET IDENTITY resets the
# auto incrementing primary key, CASCADE deletes any dependent entities. With
# sqlite3 in development you need instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_transactions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.transactions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM transactions"))
        
    db.session.commit()
