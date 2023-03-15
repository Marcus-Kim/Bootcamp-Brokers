from flask import Blueprint, jsonify, request
from app.models import User, Watchlist
from flask_login import login_required
from app.models.db import db
from flask_login import current_user
from app.models.watchlist_stock import watchlist_stocks
from sqlalchemy.sql import select
from flask_cors import cross_origin

watchlist_routes = Blueprint('watchlists', __name__)

#TODO Create necessary validations for each route (doesn't exist/not authorized)
#* Get all user watchlists --> user_routes

##* Get user Watchlist by Id
##? Haven't tested on postman yet
##? Needs Seeder files

@watchlist_routes.route('/<int:id>')
# @login_required
def watchlist_by_id(id):
    """Route for getting a watchlist by id"""
    watchlist = Watchlist.query.get(id)
    return watchlist.to_dict()

@watchlist_routes.route('/<int:id>', methods=['DELETE'])
# @login_required
def delete_watchlist_by_id(id):
    """Route for deleting a watchlist by id"""
    watchlist = Watchlist.query.get(id)

    if not watchlist:
        return "Specified watchlist does not exist"

    db.session.delete(watchlist)
    db.session.commit()
    return "Successfully Deleted"

@watchlist_routes.route('/', methods=['POST'])
@login_required
def create_watchlist():
    """Route for creating a watchlist"""
    res = request.get_json()
    #TODO Implement getting currently logged in user id to populate user_id in new watchlist
    new_watchlist = Watchlist(list_name=res['list_name'], user_id=res['user_id'])
    db.session.add(new_watchlist)
    db.session.commit()
    return new_watchlist.to_dict()

@watchlist_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_watchlist(id):
    """Route for updating a watchlist by id"""
    res = request.get_json()
    watchlist = Watchlist.query.get(id)

    watchlist.list_name = res['list_name']
    db.session.commit()
    return watchlist.to_dict()

# Delete a specific stock from a watchlist
@watchlist_routes.route('/<int:watchlistId>/stock/<string:stockTicker>', methods=['DELETE'])
@login_required
@cross_origin()
def delete_watchlist_stock(watchlistId, stockTicker): #Have to be same name as url
    delete_statement = watchlist_stocks.delete().where(
        (watchlist_stocks.c.watchlist_id == watchlistId) &
        (watchlist_stocks.c.ticker_id == stockTicker)
    )

    result = db.session.execute(delete_statement)

    db.session.commit()
    return Watchlist.query.get(watchlistId).to_dict()
