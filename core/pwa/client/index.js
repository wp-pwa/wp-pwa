/* eslint-disable global-require, no-underscore-dangle */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { AppContainer } from 'react-hot-loader';
import { hydrate } from 'react-emotion';
import { addPackage } from 'worona-deps';
import App from '../shared/components/App';
import initStore from '../shared/store';
import reducers from '../shared/store/reducers';
import buildModule from '../shared/packages/build';
import settingsModule from '../shared/packages/settings';

addPackage({ namespace: 'build', module: buildModule });
addPackage({ namespace: 'settings', module: settingsModule });

const history = createHistory();

let store = null;

const importPromises = ({ name, namespace }) =>
  new Promise((resolve, reject) => {
    const universalModule = import(`../../../packages/${name}/src/pwa`);
    universalModule.then(module => resolve({ name, namespace, module })).catch(reject);
  });

const render = async Component => {
  ReactDOM.hydrate(
    <AppContainer>
      <Component history={history} store={store} />
    </AppContainer>,
    document.getElementById('root'),
  );
};

const init = async () => {
  // Adds server generated styles to emotion cache.
  hydrate(window.__wp_pwa__.emotionIds);
  // Wait for activated packages.
  const pkgEntries = Object.entries(window.__wp_pwa__.initialState.build.packages);
  const pkgPromises = pkgEntries.map(([namespace, name]) => importPromises({ name, namespace }));
  const pkgModules = await Promise.all(pkgPromises);
  // Load reducers and sagas.
  pkgModules.forEach(pkg => {
    if (pkg.module.reducers) reducers[pkg.namespace] = pkg.module.reducers();
    // if (pkg.serverSaga) serverSagas[pkg.name] = pkg.serverSaga;
    addPackage({ namespace: pkg.namespace, module: pkg.module });
  });
  // Init store.
  store = initStore({
    reducer: combineReducers(reducers),
    initialState: window.__wp_pwa__.initialState,
  });
  // Start all the client sagas.
  store.dispatch(buildModule.actions.clientStarted());
  // if (sagas) Object.values(sagas).forEach(saga => store.runSaga(saga));
  store.dispatch(buildModule.actions.clientSagasInitialized());
  // Start App.
  render(App);
};

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('../shared/components/App.js', () => {
    const Component = require('../shared/components/App').default;
    render(Component);
  });
}

init();
