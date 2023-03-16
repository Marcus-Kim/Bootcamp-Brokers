from app.models import db, PortfolioValue, environment, SCHEMA
from sqlalchemy.sql import text



# Adds demo portfolios with dynamic seed data
import random
from datetime import datetime, timedelta

def is_market_open(current_time):
    market_open_hour = 9
    market_close_hour = 17
    return market_open_hour <= current_time.hour < market_close_hour


def generate_portfolio_values(portfolio_id, start_date, end_date, min_balance, max_balance, volatility=0.03):
    date_range = (end_date - start_date).days + 1
    portfolio_values = []

    for day in range(date_range):
        initial_price = random.uniform(min_balance, max_balance)
        prices = [initial_price]
        current_time = start_date + timedelta(days=day, hours=9)

        while current_time <= start_date + timedelta(days=day, hours=17):
            if is_market_open(current_time):
                change_pct = random.gauss(0, volatility)
                new_price = prices[-1] * (1 + change_pct)
                prices.append(new_price)

                portfolio_values.append({
                    'x': current_time,
                    'y': new_price
                })

            current_time += timedelta(minutes=5)

    return portfolio_values


def seed_portfolio_values():
    start_date = datetime(2022, 12, 5)
    end_date = datetime(2023, 3, 14)

    portfolios_values = [
        generate_portfolio_values(1, start_date, end_date, 500, 1500),
        generate_portfolio_values(2, start_date, end_date, 1500, 2500),
        generate_portfolio_values(3, start_date, end_date, 2500, 3500)
    ]

    for portfolio_id, portfolio_values in enumerate(portfolios_values, start=1):
        # Sort the portfolio values in descending order by date
        sorted_portfolio_values = sorted(portfolio_values, key=lambda x: x['x'], reverse=True)

        for value in sorted_portfolio_values:
            db.session.add(PortfolioValue(
                portfolio_id=portfolio_id,
                current_balance=value['y'],
                date=value['x']
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
