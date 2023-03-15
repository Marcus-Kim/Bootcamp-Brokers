import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import portfolioReducer from './portfolio';
import reducer from './session';
import stocksReducer from './stock'
import watchlistReducer from './watchlist';
import transactionsReducer from './transactions';

const rootReducer = combineReducers({
  session: reducer,
  stocks: stocksReducer,
  watchlist: watchlistReducer,
  portfolio: portfolioReducer,
  transaction: transactionsReducer
});


let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
