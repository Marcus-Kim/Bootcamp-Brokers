from .db import db, environment, SCHEMA, add_prefix_for_prod
from .watchlist_stock import watchlist_stocks

class Watchlist(db.Model):
    __tablename__ = 'watchlists'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    list_name = db.Column(db.String(100), nullable=False, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)

    user = db.relationship("User", back_populates='watchlists')
    stocks = db.relationship(
        'Stock',
        secondary=watchlist_stocks,
        back_populates='watchlists'
    )
