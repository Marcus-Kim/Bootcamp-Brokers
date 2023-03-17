from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import User, Watchlist
from app.models.watchlist_stock import watchlist_stocks
from .watchlist_routes import watchlist_routes
from sqlalchemy.sql import text
from app.models.db import db
user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()


##* Get all users watchlist / on dashboard page
##? Havent tested on postman yet
##? Needs seeder files
@user_routes.route('/<int:userId>/watchlists')
@login_required
def all_watchlists_by_user(userId):
    """Get all watchlists by user id (aggregate data)"""
    watchlists = Watchlist.query.filter_by(user_id=userId).all()

    watchlist_data = None
    data = [stock.to_dict() for watchlist in watchlists for stock in watchlist.stocks]



    print('DATA: ', data)
    return jsonify(data)

    # if len(watchlists) > 0:
    #     watchlist_data = [watchlist.to_dict() for watchlist in watchlists]
    #     #? Modifying the 'watchlist_data' to include the related tickers list
    #     for watchlist in watchlist_data:
    #         watchlist_id = watchlist['id']
    #         sql = text(f'SELECT * FROM watchlist_stocks WHERE watchlist_stocks.watchlist_id = {watchlist_id}')
    #         result = db.session.execute(sql)
    #         watchlist_stocks = [dict(row) for row in result]
    #         watchlist_ticker_list = [ stock['ticker_id'] for stock in watchlist_stocks]
    #         watchlist['tickers'] = watchlist_ticker_list
    #     return jsonify(watchlist_data)
    # else:
    #     return jsonify([])



    # user: {
    #     watchlist: {
    #         watchlist_shares: {

    #         }
    #     },
    #     portfolio: {
    #         portfolio_shares: {
    #             stocks: {}
    #         },
    #         portfolio_value: {}
    #     },
    #     transactions: {}
    # }
