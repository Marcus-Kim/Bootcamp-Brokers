from app.models import db, Portfolio, environment, SCHEMA
from sqlalchemy.sql import text


# Adds demo portfolios, you can add other portfolios here if you want
def seed_portfolios():
    portfolios = [
        {'user_id': 1, 'cash_balance': 10000, 'initial_principle': 10000},
    ]
    
    for portfolio in portfolios:
        db.session.add(Portfolio(
            user_id=portfolio['user_id'],
            cash_balance=portfolio['cash_balance'],
            initial_principle=portfolio['initial_principle']
        ))
    
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the portfolios table. SQLAlchemy
# doesn't have a built in function to do this. With postgres in production
# TRUNCATE removes all the data from the table, and RESET IDENTITY resets the
# auto incrementing primary key, CASCADE deletes any dependent entities. With
# sqlite3 in development you need instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_portfolios():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.portfolios RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM portfolios"))
        
    db.session.commit()
