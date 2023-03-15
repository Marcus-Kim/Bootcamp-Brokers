from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Portfolio, PortfolioValue, PortfolioShare, db

portfolio_routes = Blueprint('portfolio', __name__)

# Get historical portfolio value by user id
@portfolio_routes.route('/history')
@login_required
def portfolio_historical_value_by_id():
    """Route for getting historical portfolio value by user id"""
    portfolio = Portfolio.query.filter_by(user_id=current_user.id).first()
    portfolio_values = PortfolioValue.query.filter_by(portfolio_id=portfolio.id).all()

    return [p.to_dict() for p in portfolio_values]

# Get portfolio holdings data
@portfolio_routes.route('/holdings')
@login_required
def holdings():
    """Route for getting portfolio holdings"""
    portfolio = Portfolio.query.filter_by(user_id=current_user.id).first()
    portfolio_shares = PortfolioShare.query.filter_by(portfolio_id=portfolio.id).all()

    return [s.to_dict() for s in portfolio_shares]

# Get portfolio of current user
@portfolio_routes.route('/')
@login_required
def get_user_portfolio():
    """Route for getting a portfolio by id"""
    portfolio = Portfolio.query.get(current_user.id)
    return portfolio.to_dict()

# Buy a stock
@portfolio_routes.route('/buy', methods=['POST'])
@login_required
def add_stock_to_portfolio():
    """Route for adding a stock to a user's portfolio
    Parses, values 'ticker' and 'shares' from request body"""
    portfolio = Portfolio.query.filter_by(user_id=current_user.id).first()
    data = request.json
    ticker = data['ticker']
    shares = data['shares']
    return portfolio.buy_stock(ticker, shares)

# Sell a stock
@portfolio_routes.route('/sell', methods=['POST'])
@login_required
def remove_stock_from_portfolio():
    """Route for removing shares of a stock from a user's portfolio"""
    portfolio = Portfolio.query.filter_by(user_id=current_user.id).first()
    data = request.json
    ticker = data['ticker']
    shares = data['shares']
    return portfolio.sell_stock(ticker, shares)

# Log current value of portfolio to portfolio_values table
from datetime import datetime
@portfolio_routes.route('/create-snapshot', methods=['POST'])
@login_required
def create_portfolio_snapshot():
    """Route for creating a new snapshot of portfolio current value to add to portfolio_values table"""
    portfolio = Portfolio.query.filter_by(user_id=current_user.id).first()
    try:
        db.session.add(PortfolioValue(
            portfolio_id=portfolio.id,
            current_balance=portfolio.overall_value,
            date=datetime.now()
        ))
        db.session.commit()
        portfolio_values = PortfolioValue.query.filter_by(portfolio_id=portfolio.id).all()

        return [p.to_dict() for p in portfolio_values]
    except:
        raise Exception('Error adding portfolio value to portfolio_values table')
