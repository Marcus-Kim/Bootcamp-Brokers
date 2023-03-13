from flask import Blueprint
from flask_login import login_required, current_user
from app.models import Portfolio, db

portfolio_routes = Blueprint('portfolio', __name__)

# Get historical portfolio value by portfolio id
@portfolio_routes.route('/<int:id>/history')
# @login_required
def portfolio_historical_value_by_id(id):
    """Route for getting historical portfolio value by portfolio id"""
    portfolio_values = PortfolioValue.query.filter_by(portfolio_id=id).all()

    return [p.to_dict() for p in portfolio_values]


# Log current value of portfolio to portfolio_values table
@portfolio_routes.route('/<int:id>/create-snapshot', methods=['POST'])
# @login_required
def create_portfolio_snapshot(id):
    """Route for creating a new snapshot of portfolio current value to add to portfolio_values table"""
    portfolio = Portfolio.query.get(id)
    portfolio_value = portfolio


# Get portfolio of current user
@portfolio_routes.route('/')
@ login_required
def portfolio_by_id():
    """Route for getting a portfolio by id"""
    portfolio = Portfolio.query.get(current_user.id)
    return portfolio.to_dict()
