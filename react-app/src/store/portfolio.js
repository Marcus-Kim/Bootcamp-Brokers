// ACTIONS
const GET_PORTFOLIO_HISTORICAL_VALUES = 'portfolio/GET_HISTORY' // Getting historical portfolio values by user id
const GET_PORTFOLIO_HOLDINGS = 'portfolio/GET_PORTFOLIO_HOLDINGS' // Getting portfolio holdings
const GET_USER_PORTFOLIO = 'portfolio/GET_USER_PORTFOLIO' // Getting user portfolio by id
const BUY_STOCK = 'portfolio/BUY_STOCK' // Buying a stock
const DEPOSIT = 'portfolio/DEPOSIT_CASH'
const SELL_STOCK = 'portfolio/SELL_STOCK' // Selling a stock
const CREATE_PORTFOLIO_SNAPSHOT = 'portfolio/CREATE_PORTFOLIO_SNAPSHOT' // Creating a new snapshot of portfolio current value


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

const actionBuyStock = (holding) => ({
    type: BUY_STOCK,
    holding
})

const actionSellStock = (holding) => ({
    type: SELL_STOCK,
    holding
})

const actionCreatePortfolioSnapshot = (holdings) => ({
    type: CREATE_PORTFOLIO_SNAPSHOT,
    holdings
})


// THUNKS

// Get historical portfolio value by user id
export const thunkGetPortfolioHistoricalValues = () => async (dispatch) => {
    const response = await fetch('/api/portfolio/history')

    if (response.ok) {
        const historicalValues = await response.json()
        const shapedHistoricalValues = [];
        historicalValues.forEach(value => {
            shapedHistoricalValues.push({
                x: value.date,
                y: value.current_balance
            })
        })
        await dispatch(actionGetPortfolioHistoricalValues(shapedHistoricalValues))
        return shapedHistoricalValues
    }
}

// Get portfolio holdings data
export const thunkGetPortfolioHoldings = () => async (dispatch) => {
    const response = await fetch('/api/portfolio/holdings')

    if (response.ok) {
        const holdings = await response.json()
        const normalizedHoldings = {}
        holdings.forEach(holding => {
            normalizedHoldings[holding.id] = holding;
        })
        await dispatch(actionGetPortfolioHoldings(normalizedHoldings))
        return holdings
    }
}

// Get Portfolio of Current User
export const thunkGetUserPortfolio = () => async (dispatch) => {
    const response = await fetch(`/api/portfolio/`)

    if (response.ok) {
        const portfolio = await response.json()
        await dispatch(actionGetUserPortfolio(portfolio))
        return portfolio
    }
}

// Buy a stock
export const thunkBuyStock = (ticker, shares) => async (dispatch) => {
    const response = await fetch('/api/portfolio/buy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ticker,
            shares
        })
    })
    if (response.ok) {
        const updatedHolding = await response.json()
        await dispatch(actionBuyStock(updatedHolding))
        return updatedHolding
    }
}

// Sell a Stock
export const thunkSellStock = (ticker, shares) => async (dispatch) => {
    const response = await fetch('/api/portfolio/sell', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ticker,
            shares
        })
    })
    if (response.ok) {
        const updatedHolding = await response.json()
        await dispatch(actionSellStock(updatedHolding))
        return updatedHolding
    }
}

// Deposit additional cash
export const thunkDepositCash = (amount) => async (dispatch) => {
    const response = await fetch('/api/portfolio/deposit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount
        })
    })
    if (response.ok) {
        const updatedPortfolio = await response.json()
        await dispatch(actionGetUserPortfolio())
        return updatedPortfolio
    }
}

// Log current value of portfolio to portfolio_values table
export const thunkCreatePortfolioSnapshot = () => async (dispatch) => {
    const response = await fetch('/api/portfolio/create-snapshot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (response.ok) {
        const historicalValues = await response.json()
        const shapedHistoricalValues = [];
        historicalValues.forEach(value => {
            shapedHistoricalValues.push({
                x: value.date,
                y: value.current_balance
            })
        })
        await dispatch(actionGetPortfolioHistoricalValues(shapedHistoricalValues))
        return shapedHistoricalValues
    }
}

const initialState = {
    historicalValues: [],
    holdings: {},
    portfolio: {}
}


// REDUCER
export default function portfolioReducer(state = initialState, action) {
    const newState = { ...state }
    switch(action.type) {
        case GET_PORTFOLIO_HISTORICAL_VALUES: {
            newState.historicalValues = [ ...action.historicalValues ]
            return newState
        }
        case GET_PORTFOLIO_HOLDINGS: {
            newState.holdings = { ...state.holdings }
            newState.holdings = { ...action.holdings }
            return newState
        }
        case GET_USER_PORTFOLIO: {
            newState.id = action.portfolio.id
            newState.cash_balance = action.portfolio.cash_balance
            newState.initial_principle = action.portfolio.initial_principle
            newState.profit_loss = action.portfolio.profit_loss
            newState.user_id = action.portfolio.user_id
            newState.total_stock_value = action.portfolio.total_stock_value
            newState.overall_value = action.portfolio.overall_value
            return newState
        }
        case BUY_STOCK: {
            newState.holdings[action.holding.id] = action.holding
            return newState
        }
        case SELL_STOCK: {
            newState.holdings = { ...state.holdings }
            if (action.holding.shares == 0) {
                delete newState.holdings[action.holding.id]
                return newState;
            }
            newState.holdings[action.holding.id] = { ...action.holding }
            return newState
        }
        case CREATE_PORTFOLIO_SNAPSHOT: {
            newState.holdings = { ...state.holdings }
            newState.holdings = { ...action.holdings }
            return newState
        }
        default: 
            return state
    }
}
