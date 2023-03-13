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
        {'watchlist_id': 2, 'ticker_id': 'SJM'},
        {'watchlist_id': 2, 'ticker_id': 'IBM'},
        {'watchlist_id': 3, 'ticker_id': 'CRSP'},
        {'watchlist_id': 3, 'ticker_id': 'COIN'},
        {'watchlist_id': 3, 'ticker_id': 'HOOD'},
        {'watchlist_id': 3, 'ticker_id': 'MSFT'},
        {'watchlist_id': 4, 'ticker_id': 'AI'},
        {'watchlist_id': 4, 'ticker_id': 'NVR'},
        {'watchlist_id': 4, 'ticker_id': 'LULU'},
        {'watchlist_id': 4, 'ticker_id': 'NKE'},
        {'watchlist_id': 5, 'ticker_id': 'GME'},
        {'watchlist_id': 5, 'ticker_id': 'AMC'},
        {'watchlist_id': 5, 'ticker_id': 'BBBY'},
        {'watchlist_id': 5, 'ticker_id': 'BB'},
        {'watchlist_id': 6, 'ticker_id': 'VZ'},
        {'watchlist_id': 6, 'ticker_id': 'T'},
        {'watchlist_id': 6, 'ticker_id': 'SPY'},
        {'watchlist_id': 6, 'ticker_id': 'QQQ'},
        {'watchlist_id': 7, 'ticker_id': 'BEAM'},
        {'watchlist_id': 7, 'ticker_id': 'APLS'},
        {'watchlist_id': 7, 'ticker_id': 'CRBU'},
        {'watchlist_id': 7, 'ticker_id': 'VRTX'}
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
