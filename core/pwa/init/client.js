/* eslint-disable global-require, no-underscore-dangle */
import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import { AppContainer } from 'react-hot-loader';
import { hydrate } from 'react-emotion';
import App from './components/App';

// Adds server generated styles to emotion cache.
if (typeof window !== 'undefined') {
  hydrate(window.__wp_pwa__.emotionIds);
}

const history = createHistory();

const render = Component =>
  ReactDOM.hydrate(
    <AppContainer>
      <Component history={history} />
    </AppContainer>,
    document.getElementById('root'),
  );

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./components/App.js', () => {
    const Component = require('./components/App').default;
    render(Component);
  });
}

render(App);
