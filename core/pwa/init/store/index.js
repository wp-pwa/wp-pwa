/* eslint-disable global-require */
import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import worona from 'worona-deps';

const dev = process.env.NODE_ENV !== 'production';

// Add Redux Dev Tools.
const composeEnhancers = dev ? composeWithDevTools({ serialize: false }) : compose;

// Init saga and create middlewares.
const sagaMiddleware = createSagaMiddleware();
const clientMiddleware = [sagaMiddleware];
const serverMiddleware = [sagaMiddleware];

// Add logger in dev mode.
if (dev) {
  const { createLogger } = require('redux-logger');
  clientMiddleware.push(createLogger({ diff: true, collapsed: true }));
  serverMiddleware.push(createLogger({ diff: true, collapsed: true }));
}

export default ({ reducer, initialState = {} }) => {
  // Create store for the server.
  if (typeof window === 'undefined') {
    const store = {
      ...createStore(reducer, initialState, compose(applyMiddleware(...serverMiddleware))),
      runSaga: sagaMiddleware.run,
    };
    // Add it to worona.
    worona.store = store;
    return store;
  }
  // Create store for the client.
  const store = {
    ...createStore(reducer, initialState, composeEnhancers(applyMiddleware(...clientMiddleware))),
    runSaga: sagaMiddleware.run,
  };
  return store;
};
