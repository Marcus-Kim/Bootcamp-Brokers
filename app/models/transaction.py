from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Transaction(db.Model):
    __tablename__ = 'transactions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    ticker_id = db.Column(db.String(10), db.ForeignKey(add_prefix_for_prod('stocks.ticker')), nullable=False)
    shares = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, default=datetime.now(tz=None), nullable=False)

    stock = db.relationship("Stock", uselist=False, back_populates="transactions")
    user = db.relationship("User", back_populates='transactions')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'ticker_id': self.ticker_id,
            'shares': self.shares,
            'date': self.date
        }
