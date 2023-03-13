from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Transaction
from ..models.db import db


transaction_routes = Blueprint('transactions', __name__)

# Get all transactions of logged in user
@transaction_routes.route('/')
@login_required
def get_all_transactions():
    transactions = Transaction.query.filter_by(user_id=current_user.id).all()

    result = [ transaction.to_dict() for transaction in transactions]
    return result

# Get all transaction of logged in user by ticker
@transaction_routes.route('/<string:id>')
@login_required
def get_transactions_by_ticker(id):
    ticker = id.upper()
    transactions = Transaction.query.filter_by(user_id=current_user.id).filter_by(ticker_id=ticker)
    result = [ transaction.to_dict() for transaction in transactions ]
    return result

# Create a transaction (need ticker_id and shares)
@transaction_routes.route('/', methods=['POST'])
@login_required
def create_transaction():
    req_body = request.get_json()

    user_id = current_user.id
    ticker_id = req_body['ticker_id']
    shares = req_body['shares']

    new_transaction = Transaction(user_id=user_id, ticker_id=ticker_id, shares=shares)
    db.session.add(new_transaction)
    db.session.commit()
    return new_transaction.to_dict()
