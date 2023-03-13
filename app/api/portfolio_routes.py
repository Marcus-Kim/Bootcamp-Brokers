from flask import Blueprint
from flask_login import login_required
from app.models import Portfolio, db

portfolio_routes = Blueprint('portfolio', __name__)

# Get portfolio by id
@portfolio_routes.route('/<int:id>')
# @ login_required
def portfolio_by_id(id):
    """Route for getting a portfolio by id"""
    portfolio = Portfolio.query.get(id)
    return portfolio.to_dict()
