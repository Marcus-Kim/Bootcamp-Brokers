from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import User, Watchlist
from .watchlist_routes import watchlist_routes

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
@user_routes.route('/<int:userId>/watchlists/')
# @login_required
def all_watchlists_by_user(userId):
    # user = User.query.get(userId)

    # user_dict = user.to_dict()
    # print('USER DICT VARIABLE: ', user_dict)
    # print('USER DICT ONE LINE: ', user.to_dict())

    # watchlist_data = [watchlist.to_dict() for watchlist in user.watchlists]


    watchlists = Watchlist.query.filter_by(user_id=userId).all()
    watchlist_data = [watchlist.to_dict() for watchlist in watchlists]
    return jsonify(watchlist_data)


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
