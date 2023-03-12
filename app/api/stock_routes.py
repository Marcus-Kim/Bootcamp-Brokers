from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Stock

stock_routes = Blueprint('stocks', __name__)
apiKey = "CRN1I5X51XQTTFBH"

@stock_routes.route('/stock/news/<str:ticker>')
@login_required

def stock_news():

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