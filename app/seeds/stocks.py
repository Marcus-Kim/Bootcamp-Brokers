from app.models import db, Stock, environment, SCHEMA
from sqlalchemy.sql import text


# Adds demo stocks, you can add other portfolios here if you want
def seed_stocks():
    stocks = [
        {'ticker': 'TSLA', 'company_name': 'Tesla, Inc.', 'current_price': 173.44, 'daily_change': 0.0030 },
        {'ticker': 'AAPL', 'company_name': 'Apple, Inc.', 'current_price': 148.50, 'daily_change': -0.0139 },
        {'ticker': 'AMZN', 'company_name': 'Amazon.com, Inc.', 'current_price': 90.73, 'daily_change': -0.0165 },
        {'ticker': 'GOOG', 'company_name': 'Alphabet, Inc.', 'current_price': 91.01, 'daily_change': -0.0178 },
    ]
    
    for stock in stocks:
        db.session.add(Stock(
            ticker=stock['ticker'],
            company_name=stock['company_name'],
            current_price=stock['current_price'],
            daily_change=stock['daily_change']
        ))
    
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the stocks table. SQLAlchemy
# doesn't have a built in function to do this. With postgres in production
# TRUNCATE removes all the data from the table, and RESET IDENTITY resets the
# auto incrementing primary key, CASCADE deletes any dependent entities. With
# sqlite3 in development you need instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM stocks"))
        
    db.session.commit()
