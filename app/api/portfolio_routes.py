from flask import Blueprint
from flask_login import login_required, current_user
from app.models import Portfolio, db

portfolio_routes = Blueprint('portfolio', __name__)

# Get portfolio of current user
@portfolio_routes.route('/')
@ login_required
def portfolio_by_id():
    """Route for getting a portfolio by id"""
    portfolio = Portfolio.query.get(current_user.id)
    return portfolio.to_dict()
