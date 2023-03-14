from .db import db, environment, SCHEMA, add_prefix_for_prod
from .watchlist_stock import watchlist_stocks

class Watchlist(db.Model):
    __tablename__ = 'watchlists'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    list_name = db.Column(db.String(100), nullable=False, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)

    user = db.relationship("User", back_populates='watchlists')
    stocks = db.relationship(
        'Stock',
        secondary=watchlist_stocks,
        back_populates='watchlists'
    )

    def to_dict(self):
        stocks = self.stocks
        dict_stocks = [stock.to_dict() for stock in stocks]
        return {
            'id': self.id,
            'list_name': self.list_name,
            'user_id': self.user_id,
            'stocks': dict_stocks
        }
