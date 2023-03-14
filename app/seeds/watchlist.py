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
    watchlist4 = Watchlist(
        list_name = "Wishful thinking",
        user_id = 2
    )
    watchlist5 = Watchlist(
        list_name = "Money Printer",
        user_id = 2
    )
    watchlist6 = Watchlist(
        list_name = "Long Term",
        user_id = 2
    )
    watchlist7 = Watchlist(
        list_name = "Gene Stocks",
        user_id = 3
    )

    all_watchlists = [watchlist1, watchlist2, watchlist3, watchlist4, watchlist5, watchlist6, watchlist7]

    for watchlist in all_watchlists:
        db.session.add(watchlist)

    db.session.commit()

def undo_watchlists():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlists RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM watchlists"))

    db.session.commit()
