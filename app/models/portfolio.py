from .db import db, environment, SCHEMA, add_prefix_for_prod
from .transaction import Transaction
from .portfolio_shares import PortfolioShare
from .stock import Stock


class Portfolio(db.Model):
    __tablename__ = "portfolios"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id"), ondelete='CASCADE'), nullable=False)
    cash_balance = db.Column(db.Float(asdecimal=True, decimal_return_scale=2), nullable=False)
    initial_principle = db.Column(db.Float(asdecimal=True, decimal_return_scale=2), nullable=False)

    user = db.relationship("User", uselist=False, back_populates="portfolio")
    portfolio_shares = db.relationship("PortfolioShare", back_populates="portfolio")
    portfolio_values = db.relationship("PortfolioValue", back_populates="portfolio")

    @property
    def total_stock_value(self):
        total_stock_value = sum(
            share.stocks.current_price * share.shares for share in self.portfolio_shares
        )
        return total_stock_value

    @property
    def overall_value(self):
        from decimal import Decimal
        return Decimal(self.total_stock_value) + self.cash_balance

    @property
    def profit_loss(self):
        return self.overall_value - self.initial_principle

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'profit_loss': self.profit_loss,
            'cash_balance': self.cash_balance,
            'initial_principle': self.initial_principle,
            'total_stock_value': self.total_stock_value,
            'overall_value': self.overall_value
        }


    def buy_stock(self, ticker, num_shares):
        """Method for adding a stock to a user's portfolio"""
        # If num_shares is not greater than zero, return error
        if type(num_shares) is not int or num_shares < 1:
            raise Exception('Number of shares of stock to purchase must be an integer greater than 0')
            # return {'error': 'Number of shares of stock to purchase must be an integer greater than 0'}

        # If user has insufficient funds for purchase, return error
        if self.check_funds(ticker, num_shares) == False:
            raise Exception('User has insufficient funds to complete purchase')
            # return {'error': 'User has insufficient funds to complete purchase'}

        # Subtract cost of sale from user cash_balance
        stock = Stock.query.get(ticker)
        self.cash_balance -= stock.calculate_value(num_shares)
        db.session.commit()

        # Check if value exists in portfolio_shares table
        table_row = PortfolioShare.query.filter(PortfolioShare.portfolio_id == self.id, PortfolioShare.ticker_id == ticker).first()
        if table_row:
            # Increment number of shares by num_shares in portfolio_shares table
            table_row.shares += num_shares

            # Create transaction to reflect change in shares
            db.session.add(Transaction(
                user_id=self.user_id,
                ticker_id=ticker,
                shares=num_shares,
            ))
            db.session.commit()
            return table_row.to_dict()
        else:
            # Create new row in portfolio shares table
            db.session.add(PortfolioShare(
                portfolio_id=self.id,
                ticker_id=ticker,
                shares=num_shares
            ))

            # Create transaction to reflect change in shares
            db.session.add(Transaction(
                user_id=self.user_id,
                ticker_id=ticker,
                shares=num_shares,
            ))
            db.session.commit()

            # Query for the new row to get its id and return it as a dict
            new_row = PortfolioShare.query.filter_by(portfolio_id=self.id, ticker_id=ticker).first()
            return new_row.to_dict()

    def sell_stock(self, ticker, num_shares):
        """Method for selling shares of a stock from a user's portfolio"""
        # If num_shares is not greater than zero, return error
        if type(num_shares) is not int or num_shares < 1:
            return {'error': 'Number of shares of stock to sell must be an integer greater than 0'}

        # Check if value exists in portfolio_shares table
        table_row = PortfolioShare.query.filter(PortfolioShare.portfolio_id == self.id, PortfolioShare.ticker_id == ticker).first()
        if table_row:
            # Check if number of shares to be decremented would result in a total greater than 0
            if table_row.shares - num_shares < 0:
                return { 'error': 'Number of shares to sell must be less than or equal number of owned shares'}

            # Add value of sale to user cash_balance
            stock = Stock.query.get(ticker)
            self.cash_balance += stock.calculate_value(num_shares)
            db.session.commit()

            # Create transaction to reflect change in shares
            db.session.add(Transaction(
                user_id=self.user_id,
                ticker_id=ticker,
                shares=(num_shares * -1),
            ))
            db.session.commit()
            
            # Decrement number of shares by num_shares in portfolio_shares table
            table_row.shares -= num_shares

            # Check if user has sold all remaining shares of stock, remove from portfolio in this case
            if table_row.shares == num_shares:
                db.session.delete(table_row)
                db.session.commit()

                table_row.shares = 0
                return table_row.to_dict()

            return table_row.to_dict()
        else:
            return {'error': 'Stock with this ticker symbol not found in user portfolio'}

    def check_funds(self, ticker, num_shares):
        """Method for checking if user has the buying power to complete a purchase
        Calculated by multiplying shares by stock price for a total cost, and subtracting from user cash_balance"""
        stock = Stock.query.get(ticker)
        cost_of_purchase = stock.current_price * num_shares
        return (self.cash_balance - cost_of_purchase) >= 0
