from app.models import db, PortfolioShare, environment, SCHEMA
from sqlalchemy.sql import text

def seed_portfolio_shares():
    portfolio_shares = [
        {'portfolio_id': 1, 'ticker_id': 'TSLA', 'shares': 3},
        {'portfolio_id': 1, 'ticker_id': 'AAPL', 'shares': 2},
        {'portfolio_id': 1, 'ticker_id': 'GOOG', 'shares': 2},
        {'portfolio_id': 2, 'ticker_id': 'AAPL', 'shares': 1},
        {'portfolio_id': 2, 'ticker_id': 'AMZN', 'shares': 1},
        {'portfolio_id': 2, 'ticker_id': 'GOOG', 'shares': 2},
        {'portfolio_id': 2, 'ticker_id': 'TSLA', 'shares': 1},
        {'portfolio_id': 3, 'ticker_id': 'AAPL', 'shares': 2},
        {'portfolio_id': 3, 'ticker_id': 'AMZN', 'shares': 1},
        {'portfolio_id': 3, 'ticker_id': 'GOOG', 'shares': 3},
        {'portfolio_id': 3, 'ticker_id': 'TSLA', 'shares': 3},
    ]
    
    for share in portfolio_shares:
        db.session.add(PortfolioShare(
            portfolio_id=share['portfolio_id'],
            ticker_id=share['ticker_id'],
            shares=share['shares']
        ))
        
    db.session.commit()

def undo_portfolio_shares():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.portfolio_shares RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM portfolio_shares"))
        
    db.session.commit()
