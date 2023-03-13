from app.models import db, Stock, environment, SCHEMA
from sqlalchemy.sql import text


# Adds demo stocks, you can add other portfolios here if you want
def seed_stocks():
    stocks = [
        {'ticker': 'TSLA', 'company_name': 'Tesla, Inc.', 'current_price': 173.44, 'daily_change': 0.0030 },
        {'ticker': 'AAPL', 'company_name': 'Apple, Inc.', 'current_price': 148.50, 'daily_change': -0.0139 },
        {'ticker': 'AMZN', 'company_name': 'Amazon.com, Inc.', 'current_price': 90.73, 'daily_change': -0.0165 },
        {'ticker': 'GOOG', 'company_name': 'Alphabet, Inc.', 'current_price': 91.01, 'daily_change': -0.0178 },
        {'ticker': 'CRM', 'company_name': 'Salesforce, Inc.', 'current_price': 175.69, 'daily_change': 0.0118 },
        {'ticker': 'AMD', 'company_name': 'Advanced Micros Devices, Inc.', 'current_price': 82.70, 'daily_change': 0.0036 },
        {'ticker': 'NVDA', 'company_name': 'Nvidia Corporation', 'current_price': 230.07, 'daily_change': 0.0013 },
        {'ticker': 'KO', 'company_name': 'The Coca-Cola Company', 'current_price': 60.56, 'daily_change': 0.0228 },
        {'ticker': 'BBY', 'company_name': 'Best Buy Co. Inc.', 'current_price': 76.60, 'daily_change': 0.0258 },
        {'ticker': 'IBM', 'company_name': 'The International Business Machines Corporation', 'current_price': 125.82, 'daily_change': 0.0025 },
        {'ticker': 'CRSP', 'company_name': 'CRISPR Therapeutics AG', 'current_price': 45.82, 'daily_change': 0.0602 },
        {'ticker': 'COIN', 'company_name': 'Coinbase Global, Inc.', 'current_price': 58.63, 'daily_change': 0.0952 },
        {'ticker': 'HOOD', 'company_name': 'Robinhood Markets, Inc.', 'current_price': 9.04, 'daily_change': 0.0028 },
        {'ticker': 'MSFT', 'company_name': 'Microsoft Corporation', 'current_price': 256.24, 'daily_change': 0.0312 },
        {'ticker': 'AI', 'company_name': 'C3.ai, Inc.', 'current_price': 21.62, 'daily_change': 0.0162 },
        {'ticker': 'LULU', 'company_name': 'lululemon athletica inc.', 'current_price': 293.43, 'daily_change': -0.0089 },
        {'ticker': 'NKE', 'company_name': 'Nike, Inc.', 'current_price': 117.69, 'daily_change': 0.0094 },
        {'ticker': 'GME', 'company_name': 'GameStop Corp.', 'current_price': 16.89, 'daily_change': -0.0249 },
        {'ticker': 'AMC', 'company_name': 'AMC Entertainment Holdings, Inc.', 'current_price': 5.41, 'daily_change': 0.0056 },
        {'ticker': 'BBBY', 'company_name': 'Bed Bath & Beyond Inc.', 'current_price': 1.29, 'daily_change': -0.0410 },
        {'ticker': 'BB', 'company_name': 'BlackBerry Limited', 'current_price': 3.59, 'daily_change': 0.0014 },
        {'ticker': 'T', 'company_name': 'AT&T Inc.', 'current_price': 18.24, 'daily_change': 0.0103 },
        {'ticker': 'SPY', 'company_name': 'The SPDR S&P 500 ETF', 'current_price': 386.90, 'daily_change': 0.0017 },
        {'ticker': 'QQQ', 'company_name': 'Invesco QQQ Trust Series 1', 'current_price': 291.71, 'daily_change': 0.0108 },
        {'ticker': 'BEAM', 'company_name': 'Beam Therapeutics, Inc.', 'current_price': 33.07, 'daily_change': 0.0299 },
        {'ticker': 'APLS', 'company_name': 'Apellis Pharmaceuticals, Inc.', 'current_price': 62.84, 'daily_change': 0.010 },
        {'ticker': 'CRBU', 'company_name': 'Caribou Biosciences, Inc.', 'current_price': 5.21, 'daily_change': 0.0048 },
        {'ticker': 'VRTX', 'company_name': 'Vertex Pharmaceuticals', 'current_price': 292.91, 'daily_change': 0.0197 },
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
