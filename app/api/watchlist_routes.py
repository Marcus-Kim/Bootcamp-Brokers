from flask import Blueprint, jsonify
from app.models import User, Watchlist
from flask_login import login_required
from app.models.db import db

watchlist_routes = Blueprint('watchlists', __name__)


#* Get all user watchlists --> user_routes

##* Get user Watchlist by Id
##? Haven't tested on postman yet
##? Needs Seeder files

@watchlist_routes.route('/<int:id>')
@login_required
def watchlist_by_id(id):
    watchlist = Watchlist.query.get(id)
    return watchlist.to_dict()

@watchlist_routes.route('/<int:id>', methods=['DELETE'])
# @login_required
def delete_watchlist_by_id(id):
    watchlist = Watchlist.query.get(id)

    if not watchlist:
        return "Specified watchlist does not exist"
    
    db.session.delete(watchlist)
    db.session.commit()
    return "Successfully Deleted"
