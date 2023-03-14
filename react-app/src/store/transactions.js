// Actions
const GET_ALL_TRANSACTIONS = 'transactions/GET_ALL_TRANSACTIONS'
const GET_ALL_TRANSACTIONS_BY_TICKER = 'transactions/GET_ALL_TRANSACTIONS_BY_TICKER'
const CREATE_TRANSACTION = 'transactions/CREATE_TRANSACTION'

// Action Creators
const actionGetAllTransactions = (transaction) => ({
    type: GET_ALL_TRANSACTIONS,
    transaction
})

const actionGetAllTransactionsByTicker = (transaction) => ({
    type: GET_ALL_TRANSACTIONS_BY_TICKER
})

// export const transactionsReducer = (state = initialState, action) {

// }