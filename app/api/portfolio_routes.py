from flask import Blueprint
from flask_login import login_required
from app.models import Portfolio, db

portfolio_routes = Blueprint('portfolios', __name__)


