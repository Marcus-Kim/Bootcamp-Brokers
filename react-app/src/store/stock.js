import getCurrentDateTimeString from "../util/date"

const apiKey="8FTZB1IE3KP1Q779"


// constants
const GET_STOCK_INTRADAY = 'stocks/GET_STOCK_INTRADAY'
const GET_STOCK_DAILY = 'stocks/GET_STOCK_DAILY'
const GET_STOCK_WEEKLY = 'stocks/GET_STOCK_WEEKLY'
const GET_STOCK_NEWS = 'stocks/GET_STOCKNEWS'
const GET_STOCK_FUNDAMENTALS = 'stocks/GET_STOCK_FUNDAMENTALS'
const GET_BTC_PRICE = 'stocks/GET_BTC_PRICE'
const GET_ONE_WEEK_CHART_DATA = '/stocks/GET_ONE_WEEK_CHART_DATA'
const GET_ONE_MONTH_CHART_DATA = '/stocks/GET_ONE_MONTH_CHART_DATA'
const GET_RANDOM_STOCK_NEWS = 'stocks/GET_RANDOM_STOCK_NEWS'
const GET_SPY = 'stocks/GET_SPY'
const GET_NASDAQ = 'stocks/GET_NASDAQ'
const GET_ONE_YEAR_CHART_DATA = "/stocks/GET_ONE_YEAR_CHART_DATA"

const UPDATE_STOCK_PRICES = 'stocks/UPDATE_PRICES_IN_DATABASE'
const GET_ALL_28_STOCKS = "/stocks/GET_ALL_28_STOCKS"

//actions
const actionGetStockIntraday = (stocks) => ({
    type: GET_STOCK_INTRADAY,
    stocks
})

const actionGetAll28Stocks = (stocks) => ({
    type: GET_ALL_28_STOCKS,
    stocks
})

const actionGetStockDaily = (stocks) => ({
    type: GET_STOCK_DAILY,
    stocks
})


const actionGetStockWeekly = (stocks) => ({
    type: GET_STOCK_WEEKLY,
    stocks
})


const actionGetStockNews = (news) => ({
    type: GET_STOCK_NEWS,
    news
})

const actionGetStockFundamentals = (stocks) => ({
    type: GET_STOCK_FUNDAMENTALS,
    stocks
})

const actionGetBTCPrice = (BTC) => ({
    type: GET_BTC_PRICE,
    BTC
})
const actionGetOneWeekStockData = (stocks) => ({
    type: GET_ONE_WEEK_CHART_DATA,
    stocks
})

const actionGetOneMonthStockData = (stocks) => ({
    type: GET_ONE_MONTH_CHART_DATA,
    stocks
})

const actionGetOneYearStockData = (stocks) => ({
    type: GET_ONE_YEAR_CHART_DATA,
    stocks
})


const actionGetRandomStockNews = (news) => ({
    type: GET_RANDOM_STOCK_NEWS,
    news
})

const actionGetSpy = (stocks) => ({
    type: GET_SPY,
    stocks
})

const actionGetNasdaq = (stocks) => ({
    type: GET_NASDAQ,
    stocks
})

const allTickers = [
    'TSLA', 'AAPL', 'AMZN',
    'GOOG', 'CRM', 'AMD',
    'NVDA', 'KO', 'BBY',
    'IBM', 'CRSP', 'COIN',
    'HOOD', 'MSFT', 'AI',
    'LULU', 'NKE', 'GME',
    'AMC', 'TEAM', 'BB',
    'T', 'SPY', 'QQQ',
    'BEAM', 'APLS', 'CRBU',
    'VRTX'
  ]



const actionUpdateStockPrices = (stocks) => ({
    type: UPDATE_STOCK_PRICES,
    stocks
})

// thunks
export const thunkGetStockNews = ticker => async (dispatch) => {
    const response = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${ticker}&apikey=${apiKey}`)

    if (response.ok) {
        const stockNews = await response.json()
        dispatch(actionGetStockNews(stockNews))
        return stockNews
    }
}

export const thunkGetAll28Stocks = () => async(dispatch) => {
    const allStockData = {};

    // Use Promise.all to wait for all API requests to finish
    await Promise.all(
        allTickers.map(async ticker => {
            const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=1min&apikey=${apiKey}`);

            if (response.ok) {
                const stockData = await response.json();
                if (stockData.Information) return console.log('API MINUTE LIMIT REACHED', 'Try again in 1 minute')
                const timeSeriesKey = "Time Series (1min)";
                const closingPriceKey = "4. close";
                const latestTimestamp = Object.keys(stockData[timeSeriesKey])[0]; // Undefined
                const closingPrice = parseFloat(stockData[timeSeriesKey][latestTimestamp][closingPriceKey]);

                allStockData[ticker] = closingPrice;
            } else if (response.status === 503) {
                console.log(`Service Unavailable for ticker: ${ticker}. Retry after some time.`);
                allStockData[ticker] = 150.00; // temp default when alphavantage returns 500-range error
            }
        })
    );

    // Dispatch the action with all stock data
    dispatch(actionGetAll28Stocks(allStockData));
};




export const thunkGetStockIntraDay = (ticker, interval) => async (dispatch) => {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=${interval}&apikey=${apiKey}`)

    if (response.ok) {
        const IntraDay = await response.json()
        dispatch(actionGetStockIntraday(IntraDay))
        return IntraDay
    }
}

export const thunkGetStockDaily = ticker => async (dispatch) => {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&outputsize=compact&apikey=${apiKey}`)

    if (response.ok) {
        const Daily = await response.json()
        dispatch(actionGetStockDaily(Daily))
        return Daily
    }
}

export const thunkGetStockWeekly = ticker => async (dispatch) => {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${ticker}&apikey=${apiKey}`)

    if (response.ok) {
        const Weekly = await response.json()
        dispatch(actionGetStockWeekly(Weekly))
        return Weekly
    }
}

export const thunkGetStockFundamentals = (ticker) => async (dispatch) => {
    const response = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${apiKey}`)

    if (response.ok) {
        const StockFundamentals = await response.json()
        dispatch(actionGetStockFundamentals(StockFundamentals))
        return StockFundamentals
    }
}

export const thunkGetBTCPrice = () => async (dispatch) => {
    const response = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=${apiKey}`)

    if (response.ok) {
        const BTCPrice = await response.json()
        dispatch(actionGetBTCPrice(BTCPrice))
        return BTCPrice
    }
}
export const thunkGetOneWeekStockData = (ticker) => async (dispatch) => {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=15min&outputsize=full&apikey=${apiKey}`)

    if (response.ok) {
        const result = await response.json()
        dispatch(actionGetOneWeekStockData(result))
        return result
    }
}

export const thunkGetSPY = () => async (dispatch) => {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=SPY&outputsize=compact&apikey=${apiKey}`)

    if (response.ok) {
        const Daily = await response.json()
        dispatch(actionGetSpy(Daily))
        return Daily
    }
}

export const thunkGetNasdaq = () => async (dispatch) => {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=QQQ&outputsize=compact&apikey=${apiKey}`)

    if (response.ok) {
        const Daily = await response.json()
        dispatch(actionGetNasdaq(Daily))
        return Daily
    }
}

// 1 Month Chart
export const thunkGetOneMonthStockData = (ticker) => async (dispatch) => {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=60min&outputsize=full&apikey=${apiKey}`)

    if (response.ok) {
        const result = await response.json()
        dispatch(actionGetOneMonthStockData(result))
        return result
    }
}

// 1 Year Chart
export const thunkGetOneYearStockData = (ticker) => async (dispatch) => {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&outputsize=full&apikey=${apiKey}`)

    if (response.ok) {
        const result = await response.json()
        dispatch(actionGetOneYearStockData(result))
        return result
    }
}

export const thunkGetRandomStockNews = () => async (dispatch) => {
    const response = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${apiKey}`)

    if (response.ok) {
        const stockNews = await response.json()
        dispatch(actionGetRandomStockNews(stockNews))
        return stockNews
    }
}

export const thunkUpdateStockPrices = (stocksObj) => async (dispatch) => {
    const response = await fetch(`/api/stocks/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(stocksObj)
    })

    if (response.ok) {
        const result = await response.json()
        dispatch(actionUpdateStockPrices(result))
        return result
    }
}

const initialState = {
    stockNews: {},
    stockIntraDay: {},
    stockDaily: {},
    stockWeekly: {},
    stockMonthly: {},
    stockFundamentals: {},
    BTCPrice: {},
    randomStockNews: {},
    SPY: {},
    Nasdaq: {},
    oneWeekChartData: {},
    oneMonthChartData: {},
    oneYearChartData: {},
    all28Stocks: {}
}

// reducers
export default function stocksReducer(state = initialState, action) {
    switch(action.type) {
        case GET_STOCK_INTRADAY: {
            const newState = {...state}
            newState.stockIntraDay = {...state.stockIntraDay, ...action.stocks}
            return newState
        }
        case GET_ALL_28_STOCKS: {
            const newState = {...state}
            newState.all28Stocks = {...state.all28Stocks, ...action.stocks}
            return newState
        }
        case GET_STOCK_DAILY: {
            const newState = {...state}
            newState.stockDaily = {...state.stockDaily, ...action.stocks}
            return newState
        }
        case GET_STOCK_NEWS: {
            const newState = {...state}
            newState.stockNews = {...state.stockNews, ...action.news}
            return newState
        }
        case GET_STOCK_FUNDAMENTALS: {
            const newState = {...state}
            newState.stockFundamentals = {...state.stockFundamentals, ...action.stocks}
            return newState
        }
        case GET_BTC_PRICE: {
            const newState = {...state}
            newState.BTCPrice = {...state.BTCPrice, ...action.BTC}
            return newState
        }
        case GET_STOCK_WEEKLY: {
            const newState = {...state}
            newState.stockWeekly = {...state.stockWeekly, ...action.stocks}
            return newState
        }
        case GET_ONE_WEEK_CHART_DATA: {
            const newState = {...state}
            newState.oneWeekChartData = {...state.oneWeekChartData, ...action.stocks}
            return newState
        }
        case GET_ONE_MONTH_CHART_DATA: {
            const newState = {...state}
            newState.oneMonthChartData = {...state.oneMonthChartData, ...action.stocks}
            return newState
        }
        case GET_RANDOM_STOCK_NEWS: {
            const newState = {...state}
            newState.randomStockNews = {...state.randomStockNews, ...action.news}
            return newState
        }
        case GET_NASDAQ: {
            const newState = {...state}
            newState.Nasdaq = {...state.Nasdaq, ...action.stocks}
            return newState
        }
        case GET_SPY: {
            const newState = {...state}
            newState.SPY = {...state.SPY, ...action.stocks}
            return newState
        }
        case GET_ONE_YEAR_CHART_DATA: {
            const newState = {...state}
            newState.oneYearChartData = {...state.oneYearChartData, ...action.stocks}
            return newState
        }

    default:
        return state
    }
}
