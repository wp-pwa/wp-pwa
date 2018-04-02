/* eslint-disable global-require, no-underscore-dangle, import/no-dynamic-require */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers } from 'redux';
import { AppContainer } from 'react-hot-loader';
import { hydrate } from 'react-emotion';
import { addPackage } from 'worona-deps';
import App from '../components/App';
import { importPromises } from '../components/Universal';
import initStore from '../store';

const buildModule = require(`../packages/build/${process.env.MODE}`);
const settingsModule = require(`../packages/settings/${process.env.MODE}`);
// const analyticsModule = require(`../packages/analytics/${process.env.MODE}`);
const iframesModule = require(`../packages/iframes/${process.env.MODE}`);
const customCssModule = require(`../packages/customCss/${process.env.MODE}`);

// Define core modules.
const coreModules = [
  { name: 'build', namespace: 'build', module: buildModule },
  { name: 'settings', namespace: 'settings', module: settingsModule },
  // { name: 'analytics', namespace: 'analytics', module: analyticsModule },
  { name: 'iframes', namespace: 'iframes', module: iframesModule },
  { name: 'customCss', namespace: 'customCss', module: customCssModule },
];

// Get activated packages.
const packages = Object.values(window['wp-pwa'].initialState.build.packages);

let store = null;
const stores = {};

const render = Component => {
  ReactDOM.hydrate(
    <AppContainer>
      <Component
        store={store}
        core={coreModules.map(({ name, module }) => ({
          name,
          Component: module.default,
        }))}
        packages={packages}
        stores={stores}
      />
    </AppContainer>,
    document.getElementById('root'),
  );
};

const init = async () => {
  // Adds server generated styles to emotion cache.
  hydrate(window['wp-pwa'].emotionIds);

  // Wait for activated packages.
  const pkgEntries = Object.entries(window['wp-pwa'].initialState.build.packages);
  const pkgPromises = pkgEntries.map(([namespace, name]) => importPromises({ name, namespace }));
  const pkgModules = await Promise.all(pkgPromises);

  const reducers = {};
  const clientSagas = {};

  const addModules = pkg => {
    addPackage({ namespace: pkg.namespace, module: pkg.module });
  };

  // Add packages to worona-devs.
  coreModules.forEach(addModules);
  pkgModules.forEach(addModules);

  // Init store.
  store = initStore({
    reducer: () => {},
    initialState: window['wp-pwa'].initialState,
  });

  // Promised dispatch.
  const asyncDispatch = action =>
    new Promise(resolve => {
      setTimeout(() => {
        store.dispatch(action);
        resolve();
      });
    });

  const mapModules = pkg => {
    if (pkg.module.Store) pkg.module.store = pkg.module.Store.create({}, { asyncDispatch });
    if (pkg.module.store) stores[pkg.namespace] = pkg.module.store;
    if (pkg.module.reducers) reducers[pkg.namespace] = pkg.module.reducers(pkg.module.store);
    if (pkg.module.clientSagas) clientSagas[pkg.name] = pkg.module.clientSagas;
  };

  // Load reducers and sagas.
  coreModules.forEach(mapModules);
  pkgModules.forEach(mapModules);

  // Set reducers after creating mst stores.
  store.replaceReducer(combineReducers(reducers));

  // Start all the client sagas.
  store.dispatch(buildModule.actions.clientStarted());
  const params = { stores };
  if (clientSagas) Object.values(clientSagas).forEach(saga => store.runSaga(saga, params));
  store.dispatch(buildModule.actions.clientSagasInitialized());

  // Start App.
  render(App);

  // Inform that the client has been rendered.
  store.dispatch(buildModule.actions.clientRendered());
};

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('../components/App.js', () => {
    const Component = require('../components/App').default;
    render(Component);
  });
  module.hot.accept('../components/Universal.js', () => {
    const Component = require('../components/App').default;
    render(Component);
  });
}

init();
