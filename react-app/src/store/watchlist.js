import { json } from "react-router-dom"

// ACTIONS
const GET_WATCHLISTS_USER_ID = 'watchlists/user/all' // Getting all watchlists of user
const DELETE_WATCHLIST_BY_ID = 'watchlists/delete'
const CREATE_WATCHLIST = 'watchlists/create' // Creating a new watchlist
const UPDATE_WATCHLIST = 'watchlists/update' // Updating a watchlist
const DELETE_WATCHLIST_STOCK = 'watchlists/stock/delete'

// ACTION CREATORS
const actionGetAllWatchlistsUserId = (watchlists) => ({
    type: GET_WATCHLISTS_USER_ID,
    watchlists
})

const actionDeleteWatchlistById = (id) => ({
    type: DELETE_WATCHLIST_BY_ID,
    id
})

const actionCreateWatchlist = (watchlist) => ({
    type: CREATE_WATCHLIST,
    watchlist
})

const actionUpdateWatchlist = (watchlist) => ({
    type: UPDATE_WATCHLIST,
    watchlist
})



// THUNKS
export const thunkGetAllWatchlistsUserId = (id) => async (dispatch) => {
    const response = await fetch(`/api/users/${id}/watchlists`)

    if (response.ok) {
        const watchlistById = await response.json()
        dispatch(actionGetAllWatchlistsUserId(watchlistById))
        console.log('HELP MEEEEEE', watchlistById)
        return watchlistById
    }
}

export const thunkDeleteWatchlistById = (id) => async (dispatch) => {
    const response = await fetch(`/api/watchlist/${id}`, {
        method: 'DELETE'
    })

    if (response.ok) {
        dispatch(actionDeleteWatchlistById(id))
    }
}

export const thunkCreateWatchlist = (watchlist) => async (dispatch) => {
    const response = await fetch('/api/watchlist/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(watchlist)
    })

    if (response.ok) {
        const newWatchlist = await response.json()
        dispatch(actionCreateWatchlist(newWatchlist))
        return newWatchlist
    }
}

export const thunkUpdateWatchlist = (watchlist) => async (dispatch) => {
    const response = await fetch(`/api/watchlist/${watchlist.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(watchlist)
    })

    if (response.ok) {
        const updatedWatchlist = await response.json()
        dispatch(actionUpdateWatchlist(updatedWatchlist))
        return updatedWatchlist
    }
}

export const thunkDeleteWatchlistStock = (watchlistId, ticker) => async (dispatch) => {
    const response = await fetch(`/api/watchlist/${watchlistId}/stock/${ticker}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        const updatedWatchlist = await response.json()
        dispatch(actionUpdateWatchlist(updatedWatchlist))
        return updatedWatchlist
    }
}

export const thunkAddWatchlistStock = (watchlistId, ticker) => async (dispatch) => {
    const response = await fetch(`/api/watchlist/${watchlistId}/stock/${ticker}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ watchlist_id: watchlistId, ticker_id: ticker})
    })

    if (response.ok) {
        const updatedWatchlist = await response.json()
        dispatch(actionUpdateWatchlist(updatedWatchlist))
        return updatedWatchlist
    }
}

// INITIAL STATE
const initialState = {}

// REDUCER
export default function watchlistReducer(state = initialState, action) {
    switch(action.type) {
        case GET_WATCHLISTS_USER_ID: {
            const newState = {...state}
            console.log(action.watchlists)
            for (let watchlist of action.watchlists) {
                newState[watchlist.id] = watchlist
            }
            return newState
        }
        case DELETE_WATCHLIST_BY_ID: {
            const newState = {...state}
            delete newState[action.id]
            return newState
        }
        case CREATE_WATCHLIST: {
            const newState = {...state}
            newState[action.watchlist.id] = action.watchlist
            return newState
        }
        case UPDATE_WATCHLIST: {
            const newState = {...state}
            newState[action.watchlist.id] = action.watchlist
            return newState
        }
        case DELETE_WATCHLIST_STOCK: {
            const newState = {...state}
            return newState;
        }
    default:
        return state
    }
}
