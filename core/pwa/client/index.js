/* eslint-disable global-require, no-underscore-dangle */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { AppContainer } from 'react-hot-loader';
import { hydrate } from 'react-emotion';
import App from '../shared/components/App';
import initStore from '../shared/store';
import reducers from '../shared/store/reducers';
import { clientStarted, clientSagasInitialized } from '../shared/packages/build/actions';

const history = createHistory();

let store = null;

const render = async Component => {
  ReactDOM.hydrate(
    <AppContainer>
      <Component history={history} store={store} />
    </AppContainer>,
    document.getElementById('root'),
  );
}

const init = async () => {
  // Adds server generated styles to emotion cache.
  hydrate(window.__wp_pwa__.emotionIds);
  // Init store.
  store = initStore({
    reducer: combineReducers(reducers),
    initialState: window.__wp_pwa__.initialState,
  });
  // Start all the client sagas.
  store.dispatch(clientStarted());
  // if (sagas) Object.values(sagas).forEach(saga => store.runSaga(saga));
  store.dispatch(clientSagasInitialized());
  // Start App.
  render(App);
}

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('../shared/components/App.js', () => {
    const Component = require('../shared/components/App').default;
    render(Component);
  });
}

init();
