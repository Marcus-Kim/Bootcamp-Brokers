from flask import Blueprint
from flask_login import login_required
from app.models import Transaction


transaction_routes = Blueprint('transactions', __name__)

#TODO Get all transactions
@transaction_routes.route('/')
@login_required
def get_all_transactions():
    transactions = Transaction.query.all()





#TODO Transactions by stock ticker
@transaction_routes.route('/<string:id>')
@login_required
def get_transactions_by_ticker():
    transactions = Transaction.query.filter_by()
