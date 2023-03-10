const apiKey="0MPIU2TLAS20RTTM"



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


//actions
const actionGetStockIntraday = (stocks) => ({
    type: GET_STOCK_INTRADAY,
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

// thunks
export const thunkGetStockNews = ticker => async (dispatch) => {
    const response = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${ticker}&apikey=${apiKey}`)

    if (response.ok) {
        const stockNews = await response.json()
        dispatch(actionGetStockNews(stockNews))
        return stockNews
    }
}

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
        dispatch(actionGetStockDaily(Daily))
        return Daily
    }
}

export const thunkGetNasdaq = () => async (dispatch) => {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=QQQ&outputsize=compact&apikey=${apiKey}`)

    if (response.ok) {
        const Daily = await response.json()
        dispatch(actionGetStockDaily(Daily))
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
    oneYearChartData: {}
}

// reducers
export default function stocksReducer(state = initialState, action) {
    switch(action.type) {
        case GET_STOCK_INTRADAY: {
            const newState = {...state}
            newState.stockIntraDay = {...state.stockIntraDay, ...action.stocks}
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
        }        case GET_ONE_YEAR_CHART_DATA: {
            const newState = {...state}
            newState.oneYearChartData = {...state.oneYearChartData, ...action.stocks}
            return newState
        }

    default:
        return state
    }
}
