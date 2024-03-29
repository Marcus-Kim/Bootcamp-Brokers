from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Stock, db

stock_routes = Blueprint('stocks', __name__)
apiKey = "GRF5OMG8NG79W0WR"

@stock_routes.route('/update', methods=['POST'])
@login_required
def update_stock_prices():
    """Route for updating stock prices in database
    Expects and object with stock ticker as keys and price as values"""
    data = request.json
    stocks = Stock.query.all()

    for stock in stocks:
        # Find new price from request object
        stock.current_price = data[f'{stock.ticker}']
    db.session.commit()
    return [s.to_dict() for s in stocks]


# @stock_routes.route('/stock/news/<str:ticker>')
# @login_required

# def stock_news():

#       const fetchStockData = async() => {
#     const apiUrl = `https://www.alphavantage.co/query?function=${queryType}&symbol=${ticker}&apikey=${apiKey}`;
#     const response = await fetch(apiUrl)

#     const json = await response.json()

#     return json
#   }




# import aiohttp

# async def stock_news(ticker):
#     async with aiohttp.ClientSession() as session:
#         apiURL = f'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&symbol={ticker}&apikey={apiKey}'
#         async with session.get(apiURL) as response:
#             json = await response.json()
#             return json
