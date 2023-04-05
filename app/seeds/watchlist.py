from app.models import db, Watchlist, environment, SCHEMA
from sqlalchemy.sql import text

# Adds a watchlist, you can add other users here if you want
def seed_watchlists():
    watchlist1 = Watchlist(
        list_name = "Tech Meme Stocks",
        user_id = 1
    )
    watchlist2 = Watchlist(
        list_name = "Dividend Stocks",
        user_id = 1
    )
    watchlist3 = Watchlist(
        list_name = "Stuff I believe In",
        user_id = 1
    )

    all_watchlists = [watchlist1, watchlist2, watchlist3]

    for watchlist in all_watchlists:
        db.session.add(watchlist)

    db.session.commit()

def undo_watchlists():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlists RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM watchlists"))

    db.session.commit()
