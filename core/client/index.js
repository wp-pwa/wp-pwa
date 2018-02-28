/* eslint-disable global-require, no-underscore-dangle */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers } from 'redux';
import { AppContainer } from 'react-hot-loader';
import { hydrate } from 'react-emotion';
import { addPackage } from 'worona-deps';
import App from '../shared/components/App';
import { importPromises } from '../shared/components/Universal';
import initStore from '../shared/store';
import * as buildModule from '../packages/build';
import * as settingsModule from '../packages/settings';

// Define core modules.
const corePkgModules = [
  { name: 'build', namespace: 'build', module: buildModule },
  { name: 'settings', namespace: 'settings', module: settingsModule },
];

// Get activated packages.
const activatedPackages = Object.values(window['wp-pwa'].initialState.build.packages);

let store = null;
const stores = {};

const render = Component => {
  ReactDOM.hydrate(
    <AppContainer>
      <Component
        store={store}
        corePackages={corePkgModules.map(pkg => ({
          name: pkg.name,
          Component: pkg.module.default,
        }))}
        activatedPackages={activatedPackages}
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
  const activatedPkgEntries = Object.entries(window['wp-pwa'].initialState.build.packages);
  const activatedPkgPromises = activatedPkgEntries.map(([namespace, name]) =>
    importPromises({ name, namespace }),
  );
  const activatedPkgModules = await Promise.all(activatedPkgPromises);

  // Load reducers and sagas.
  const reducers = {};
  const clientSagas = {};

  const mapModules = pkg => {
    if (pkg.module.Store) pkg.module.store = pkg.module.Store.create({});
    if (pkg.module.store) stores[pkg.namespace] = pkg.module.store;
    if (pkg.module.reducers) reducers[pkg.namespace] = pkg.module.reducers(pkg.module.store);
    if (pkg.module.sagas) clientSagas[pkg.name] = pkg.module.sagas;

    addPackage({ namespace: pkg.namespace, module: pkg.module });
  };

  corePkgModules.forEach(mapModules);
  activatedPkgModules.forEach(mapModules);

  // Init store.
  store = initStore({
    reducer: combineReducers(reducers),
    initialState: window['wp-pwa'].initialState,
  });

  // Start all the client sagas.
  store.dispatch(buildModule.actions.clientStarted());
  const params = { stores };
  if (clientSagas) Object.values(clientSagas).forEach(saga => store.runSaga(saga, params));
  store.dispatch(buildModule.actions.clientSagasInitialized());

  // Start App.
  render(App);

  // Inform that the client has been rendered;
  store.dispatch(buildModule.actions.clientRendered());
};

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('../shared/components/App.js', () => {
    const Component = require('../shared/components/App').default;
    render(Component);
  });
  module.hot.accept('../shared/components/Universal.js', () => {
    const Component = require('../shared/components/App').default;
    render(Component);
  });
}

init();
