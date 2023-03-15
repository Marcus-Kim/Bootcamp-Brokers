// Actions
const GET_ALL_TRANSACTIONS_BY_USER_ID = 'transactions/GET_ALL_TRANSACTIONS_BY_USER_ID'
const CREATE_TRANSACTION_BUY = 'transactions/CREATE_TRANSACTION_BUY'
const CREATE_TRANSACTION_SELL = 'transactions/CREATE_TRANSACTION_SELL'

const GET_ALL_TRANSACTIONS_BY_TICKER = 'transactions/GET_ALL_TRANSACTIONS_BY_TICKER'

// Action Creators
const actionGetTransactionsByUserId = (transactions) => ({
    type: GET_ALL_TRANSACTIONS_BY_USER_ID,
    transactions
})

const actionCreateTransactionBuy = (transaction) => ({
    type: CREATE_TRANSACTION_BUY,
    transaction
})

const actionGetAllTransactionsByTicker = (transaction) => ({
    type: GET_ALL_TRANSACTIONS_BY_TICKER,
    transaction
})


// Thunks

const thunkGetTransactionsByUserId = (userId) => async (dispatch) => {
    const response = await fetch(`/api/transactions/${userId}`)
    if (response.ok) {
        const userTransactions = await response.json();
        dispatch(actionGetTransactionsByUserId(userTransactions))
        return userTransactions
    }
}

const thunkCreateTransactionBuy = (ticker, shares) => async (dispatch) => {
    const response = await fetch(`/api/portfolio/buy`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            ticker: ticker,
            shares: shares
        })
    })
    if (response.ok) {
        const newTransaction = await response.json()
        dispatch(actionCreateTransactionBuy(newTransaction))
        return newTransaction
    }
}

const thunkCreateTransactionSell = (ticker, shares) => async (dispatch) => {
    const response = await fetch(`/api/portfolio/sell`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            ticker: ticker,
            shares: shares
        })
    })
}

const initialState = {
    userTransactions: {}
}


export const transactionsReducer = (state = initialState, action) {
    switch (action.type) {
        case GET_ALL_TRANSACTIONS_BY_USER_ID: {
            const newState = {...state}
            newState.userTransactions = { ...state.userTransactions, ...action.transactions }
            return newState;
        }
        case CREATE_TRANSACTION_BUY: {
            const newState = {...state}
            newState.userTransactions = { ...state.userTransactions, ...action.transactions }
            return newState;
        }

        default:
            return state
    }
}
