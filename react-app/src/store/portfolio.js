// ACTIONS
const GET_PORTFOLIO_HISTORICAL_VALUES = 'portfolio/history' // Getting historical portfolio values by user id
const GET_PORTFOLIO_HOLDINGS = 'portfolio/holdings' // Getting portfolio holdings
const GET_USER_PORTFOLIO = 'portfolio/user' // Getting user portfolio by id
const BUY_STOCK = 'portfolio/buy' // Buying a stock
const SELL_STOCK = 'portfolio/sell' // Selling a stock
const CREATE_PORTFOLIO_SNAPSHOT = 'portfolio/create-snapshot' // Creating a new snapshot of portfolio current value


// ACTION CREATORS
const actionGetPortfolioHistoricalValues = (historicalValues) => ({
    type: GET_PORTFOLIO_HISTORICAL_VALUES,
    historicalValues
})

const actionGetPortfolioHoldings = (holdings) => ({
    type: GET_PORTFOLIO_HOLDINGS,
    holdings
})

const actionGetUserPortfolio = (portfolio) => ({
    type: GET_USER_PORTFOLIO,
    portfolio
})

const actionBuyStock = (portfolio) => ({
    type: BUY_STOCK,
    portfolio
})

const actionSellStock = (portfolio) => ({
    type: SELL_STOCK,
    portfolio
})

const actionCreatePortfolioSnapshot = (portfolio) => ({
    type: CREATE_PORTFOLIO_SNAPSHOT,
    portfolio
})


// THUNKS

// Get historical portfolio value by user id
export const thunkGetPortfolioHistoricalValues = () => async (dispatch) => {
    const response = await fetch('/api/portfolio/history')

    if (response.ok) {
        const historicalValues = await response.json()
        await dispatch(actionGetPortfolioHistoricalValues(historicalValues))
        return historicalValues
    }
}

// Get portfolio holdings data
export const thunkGetPortfolioHoldings = () => async (dispatch) => {
    const response = await fetch('/api/portfolio/holdings')

    if (response.ok) {
        const holdings = await response.json()
        dispatch(actionGetPortfolioHoldings(holdings))
        return holdings
    }
}

// Get Portfolio of Current User
export const thunkGetUserPortfolio = (portfolioId) => async (dispatch) => {
    const response = await fetch(`/api/portfolio/${portfolioId}`)

    if (response.ok) {
        const portfolio = await response.json()
        dispatch(actionGetUserPortfolio(portfolio))
        return portfolio
    }
}

// Buy a stock
export const thunkBuyStock = (portfolio) => async (dispatch) => {
    const response = await fetch('/api/portfolio/buy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (response.ok) {
        const portfolio = await response.json()
        dispatch(actionBuyStock(portfolio))
        return portfolio
    }
}

// Sell a Stock
//! Double check that this is correct
export const thunkSellStock = () => async (portfolio) => {
    const response = await fetch('/api/portfolio/sell', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if (response.ok) {
        const portfolio = await response.json()
        dispatch(actionSellStock(portfolio))
        return portfolio
    }
}

// Log current value of portfolio to portfolio_values table
export const thunkCreatePortfolioSnapshot = (portfolio) => async (dispatch) => {
    const response = await fetch('/api/portfolio/create-snapshot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if (response.ok) {
        const portfolio = await response.json()
        dispatch(actionCreatePortfolioSnapshot(portfolio))
        return portfolio
    }
}

const initialState = {
    historicalValues: {},
    holdings: {},
    portfolio: {}
}


// REDUCER
export default function portfolioReducer(state = initialState, action) {
    switch(action.type) {
        case GET_PORTFOLIO_HISTORICAL_VALUES: {
            const newState = {...state}
            newState.historicalValues = {...state.historicalValues, ...action.historicalValues}
            return newState
        }
        case GET_PORTFOLIO_HOLDINGS: {
            const newState = {...state}
            newState.holdings = {...state.holdings, ...action.holdings}
            return newState
        }
        case GET_USER_PORTFOLIO: {
            const newState = {...state}
            newState[action.portfolio.id] = action.portfolio
            return newState
        }
        case BUY_STOCK: {
            const newState = {...state}
            newState[action.portfolio.id] = action.portfolio
            return newState
        }
        case SELL_STOCK: {
            const newState = {...state}
            newState[action.portfolio.id] = action.portfolio
            return newState
        }
        case CREATE_PORTFOLIO_SNAPSHOT: {
            const newState = {...state}
            newState[action.portfolio.id] = action.portfolio
            return newState
        }
        default: 
            return state
    }
}
