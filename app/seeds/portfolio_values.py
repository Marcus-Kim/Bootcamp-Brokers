from app.models import db, PortfolioValue, environment, SCHEMA
from sqlalchemy.sql import text
from collections import defaultdict


# Adds demo portfolios with dynamic seed data
import random
from datetime import datetime, timedelta

def generate_portfolio_values(portfolio_id, start_date, end_date, min_balance, max_balance, volatility=0.03):
    date_range = (end_date - start_date).days + 1
    portfolio_values = defaultdict(list)

    time_frames = {
        '1D': 1,
        '1W': 7,
        '1M': 30,
        '3M': 90,
        '6M': 180,
        '1Y': 365
    }

    
    for time_frame in time_frames:
        initial_price = random.uniform(min_balance, max_balance)
        prices = [initial_price]

        for _ in range(date_range - 1):
            change_pct = random.gauss(0, volatility)
            new_price = prices[-1] * (1 + change_pct)
            prices.append(new_price)

        for i in range(date_range):
            current_date = start_date + timedelta(days=i)
            current_balance = prices[i]
            portfolio_values[time_frame].append({'x': current_date, 'y': current_balance})

    return dict(portfolio_values)


def seed_portfolio_values():
    start_date = datetime(2022, 12, 5)
    end_date = datetime(2023, 3, 14)

    portfolios_values = []
    portfolios_values += generate_portfolio_values(1, start_date, end_date, 500, 1500)
    portfolios_values += generate_portfolio_values(2, start_date, end_date, 1500, 2500)
    portfolios_values += generate_portfolio_values(3, start_date, end_date, 2500, 3500)

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
