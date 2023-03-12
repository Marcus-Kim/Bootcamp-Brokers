from flask import Blueprint, jsonify
from app.models import User
from flask_login import login_required

watchlist_routes = Blueprint('watchlists', __name__)




##* Get Watchlist by Id
##? Haven't tested on postman yet
##? Needs Seeder files

@watchlist_routes(f'/<int:id>')
@login_required
def watchlist_by_id(id):
    watchlist = Watchlist.query.get(id)
    return watchlist.to_dict()


