const apiKey = "CRN1I5X51XQTTFBH"

// constants
const GET_STOCK_INTRADAY = 'stocks/GET_STOCK_INTRADAY'
const GET_STOCK_NEWS = 'stocks/GET_STOCKNEWS'


//actions
const actionGetStockIntraday = (stocks) => ({
    type: GET_STOCK_INTRADAY,
    stocks
}) 


const actionGetStockNews = (news) => ({
    type: GET_STOCK_NEWS,
    news
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

const initialState = {
    stockNews: {},
    stockIntraDay: {}
}

// reducers
export default function stocksReducer(state = initialState, action) {
    switch(action.type) {
        case GET_STOCK_INTRADAY: {
            const newState = {...state}
            
        }
        case GET_STOCK_NEWS: {
            const newState = {...state}
            newState.stockNews = {...state.stockNews, ...action.news}
            return newState
        }
        

    default: 
        return state 
    }
}


