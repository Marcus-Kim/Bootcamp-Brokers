from app.models import db, environment, SCHEMA
from app.models.watchlist_stock import watchlist_stocks
from sqlalchemy.sql import text

def seed_watchlist_stocks():

    watchlist_stock_data = [
        {'watchlist_id': 1, 'ticker_id': 'CRM'},
        {'watchlist_id': 1, 'ticker_id': 'TSLA'},
        {'watchlist_id': 1, 'ticker_id': 'AMD'},
        {'watchlist_id': 1, 'ticker_id': 'NVDA'},
        {'watchlist_id': 2, 'ticker_id': 'KO'},
        {'watchlist_id': 2, 'ticker_id': 'BBY'},
        {'watchlist_id': 2, 'ticker_id': 'AAPL'},
        {'watchlist_id': 2, 'ticker_id': 'IBM'},
        {'watchlist_id': 3, 'ticker_id': 'CRSP'},
        {'watchlist_id': 3, 'ticker_id': 'COIN'},
        {'watchlist_id': 3, 'ticker_id': 'HOOD'},
        {'watchlist_id': 3, 'ticker_id': 'MSFT'},
    ]

    for data in watchlist_stock_data:
        stock = watchlist_stocks.insert().values(
            watchlist_id = data['watchlist_id'],
            ticker_id = data['ticker_id']
        )
        db.session.execute(stock)

    # Commit the changes to the database
    db.session.commit()

def undo_watchlist_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlist_stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM watchlist_stocks"))

    db.session.commit()
