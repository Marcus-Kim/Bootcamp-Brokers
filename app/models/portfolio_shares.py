from .db import db, environment, SCHEMA, add_prefix_for_prod


class PortfolioShare(db.Model):
    __tablename__ = "portfolio_shares"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    portfolio_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("portfolios.id"), ondelete='CASCADE'), nullable=False)
    ticker_id = db.Column(db.String(10), db.ForeignKey(add_prefix_for_prod("stocks.ticker")), nullable=False)
    shares = db.Column(db.Integer, nullable=False)

    portfolio = db.relationship("Portfolio", back_populates="portfolio_shares")
    stocks = db.relationship("Stock", back_populates="portfolios")

    def to_dict(self):
        return {
            'id': self.id,
            'portfolio_id': self.portfolio_id,
            'ticker_id': self.ticker_id,
            'shares': self.shares
        }
