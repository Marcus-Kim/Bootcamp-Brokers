from app.models import db, PortfolioValue, environment, SCHEMA
from sqlalchemy.sql import text


# Adds demo portfolios, you can add other portfolios here if you want
from datetime import datetime
def seed_portfolio_values():
    portfolios_values = [
        {'portfolio_id': 1, 'current_balance': 1000, 'date': datetime(2023, 3, 10)},
        {'portfolio_id': 1, 'current_balance': 1100, 'date': datetime(2023, 3, 11)},
        {'portfolio_id': 1, 'current_balance': 900, 'date': datetime(2023, 3, 12)},
        {'portfolio_id': 2, 'current_balance': 2000, 'date': datetime(2023, 3, 10)},
        {'portfolio_id': 2, 'current_balance': 2200, 'date': datetime(2023, 3, 11)},
        {'portfolio_id': 2, 'current_balance': 1900, 'date': datetime(2023, 3, 12)},
        {'portfolio_id': 3, 'current_balance': 3000, 'date': datetime(2023, 3, 10)},
        {'portfolio_id': 3, 'current_balance': 3300, 'date': datetime(2023, 3, 11)},
        {'portfolio_id': 3, 'current_balance': 2800, 'date': datetime(2023, 3, 12)},
    ]

    for portfolio_value in portfolios_values:
        db.session.add(PortfolioValue(
            portfolio_id=portfolio_value['portfolio_id'],
            current_balance=portfolio_value['current_balance'],
            date=portfolio_value['date']
        ))

    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the portfolios_values table. SQLAlchemy
# doesn't have a built in function to do this. With postgres in production
# TRUNCATE removes all the data from the table, and RESET IDENTITY resets the
# auto incrementing primary key, CASCADE deletes any dependent entities. With
# sqlite3 in development you need instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_portfolios_values():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.portfolio_values RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM portfolio_values"))

    db.session.commit()
