from .db import db, environment, SCHEMA, add_prefix_for_prod

watchlist_stocks = db.Table(
    'watchlist_stocks',
    db.Column(
        'ticker_id',
        db.String(10),
        db.ForeignKey(add_prefix_for_prod('stocks.ticker')),
        primary_key=True
    ),
    db.Column(
        'watchlist_id',
        db.Integer,
        db.ForeignKey(add_prefix_for_prod('watchlists.id')),
        primary_key=True
    )
)
