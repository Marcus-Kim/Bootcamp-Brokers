from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Transaction(db.Model):
    __tablename__ = 'transactions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    ticker_id = db.Column(db.String(10), db.ForeignKey(add_prefix_for_prod('stocks.ticker')), nullable=False)
    shares = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, default=datetime.now(tz=None), nullable=False)

    stock = db.relationship("Stock", uselist=False, back_populates="transaction")
    user = db.relationship("User", back_populates='transactions')
