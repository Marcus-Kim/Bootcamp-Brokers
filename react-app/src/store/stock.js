const apiKey = "CRN1I5X51XQTTFBH"
const apiKey2 = "BYS7R29VDVBEP38O"
const apiKey3 = "3M5OB7SQ4L0ZKJQH"



// constants
const GET_STOCK_INTRADAY = 'stocks/GET_STOCK_INTRADAY'
const GET_STOCK_DAILY = 'stocks/GET_STOCK_DAILY'
const GET_STOCK_NEWS = 'stocks/GET_STOCKNEWS'
const GET_STOCK_FUNDAMENTALS = 'stocks/GET_STOCK_FUNDAMENTALS'
const GET_BTC_PRICE = 'stocks/GET_BTC_PRICE'


//actions
const actionGetStockIntraday = (stocks) => ({
    type: GET_STOCK_INTRADAY,
    stocks
}) 

const actionGetStockDaily = (stocks) => ({
    type: GET_STOCK_DAILY,
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
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&outputsize=compact&apikey=${apiKey2}`)

    if (response.ok) {
        const Daily = await response.json()
        dispatch(actionGetStockDaily(Daily))
        return Daily
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
    const response = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=${apiKey3}`)

    if (response.ok) {
        const BTCPrice = await response.json()
        dispatch(actionGetBTCPrice(BTCPrice))
        return BTCPrice
    }
}

const initialState = {
    stockNews: {},
    stockIntraDay: {},
    stockDaily: {},
    stockFundamentals: {},
    BTCPrice: {}

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

    default: 
        return state 
    }
}


