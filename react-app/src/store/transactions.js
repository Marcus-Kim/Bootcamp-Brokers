// Actions
const GET_ALL_TRANSACTIONS_BY_USER_ID = 'transactions/GET_ALL_TRANSACTIONS_BY_USER_ID'
const GET_ALL_TRANSACTIONS_BY_TICKER = 'transactions/GET_ALL_TRANSACTIONS_BY_TICKER'

// Action Creators
const actionGetTransactionsByUserId = (transactions) => ({
    type: GET_ALL_TRANSACTIONS_BY_USER_ID,
    transactions
})

const actionGetAllTransactionsByTicker = (transactions) => ({
    type: GET_ALL_TRANSACTIONS_BY_TICKER,
    transactions
})

// Thunks
export const thunkGetTransactionsByUserId = () => async (dispatch) => {
    const response = await fetch(`/api/transactions`)
    if (response.ok) {
        const userTransactions = await response.json();
        const normalizedTransactions = {}
        userTransactions.forEach(transaction => {
            normalizedTransactions[transaction.ticker_id] = transaction
        })
        await dispatch(actionGetTransactionsByUserId(normalizedTransactions))
        return normalizedTransactions
    }
}

export const thunkGetAllTransactionsByTickerId = (ticker) => async (dispatch) => {
    const response = await fetch (`/api/transactions/${ticker}`)
    if (response.ok) {
        const transactionsByTicker = await response.json()
        const normalizedTransactions = {}
        transactionsByTicker.forEach(transaction => (
            normalizedTransactions[transaction.ticker_id] = transaction
        ))
        await dispatch(actionGetAllTransactionsByTicker(normalizedTransactions))
        return normalizedTransactions
    }
}

const initialState = {
    allTransactions: {},
    transactionsByTicker: {}
}


export default function transactionsReducer (state = initialState, action) {
    switch (action.type) {
        case GET_ALL_TRANSACTIONS_BY_USER_ID: {
            const newState = {...state}
            newState.allTransactions = { ...action.transactions }
            return newState;
        }
        case GET_ALL_TRANSACTIONS_BY_TICKER: {
            const newState = {...state}
            newState.transactionsByTicker = { ...action.transactions }
            return newState
        }

        default:
            return state
    }
}
