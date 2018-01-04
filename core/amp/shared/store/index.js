/* eslint-disable global-require */
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import worona from 'worona-deps';

const dev = process.env.NODE_ENV !== 'production';

// Init compose, saga and create middlewares.
let composeEnhancers = compose;
const sagaMiddleware = createSagaMiddleware();
const clientMiddleware = [sagaMiddleware];
const serverMiddleware = [sagaMiddleware];

if (dev) {
  const { composeWithDevTools } = require('redux-devtools-extension');
  const { createLogger } = require('redux-logger');
  // Add Redux Dev Tools.
  composeEnhancers = composeWithDevTools({ serialize: false });
  // Add logger in dev mode.
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
  window.worona.store = store;
  return store;
};
