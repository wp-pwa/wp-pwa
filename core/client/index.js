/* eslint-disable global-require, no-underscore-dangle, import/no-dynamic-require, no-console */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { types } from 'mobx-state-tree';
import { AppContainer } from 'react-hot-loader';
import { hydrate } from 'react-emotion';
import { addPackage } from 'worona-deps';
import request from 'superagent';
import App from '../components/App';
import { importPromises } from '../components/Universal';
import Store from '../store';

const dev = process.env.NODE_ENV !== 'production';

const analyticsModule = require(`../packages/analytics/${
  process.env.MODE
}/client`);
const iframesModule = require(`../packages/iframes/${process.env.MODE}/client`);
const adsModule = require(`../packages/ads/${process.env.MODE}/client`);
const customCssModule = require(`../packages/custom-css/${
  process.env.MODE
}/client`);
const oneSignalModule = require(`../packages/one-signal/${
  process.env.MODE
}/client`);
const disqusCommentsModule = require(`../packages/disqus-comments/${
  process.env.MODE
}/client`);

// Define core modules.
const coreModules = [
  {
    name: 'analytics',
    namespace: 'analytics',
    module: analyticsModule,
  },
  {
    name: 'iframes',
    namespace: 'iframes',
    module: iframesModule,
  },
  {
    name: 'ads',
    namespace: 'ads',
    module: adsModule,
  },
  {
    name: 'custom-css',
    namespace: 'customCss',
    module: customCssModule,
  },
  {
    name: 'one-signal',
    namespace: 'notifications',
    module: oneSignalModule,
  },
  {
    name: 'disqus-comments',
    namespace: 'comments',
    module: disqusCommentsModule,
  },
];

// Get activated packages.
const packages = Object.values(window['wp-pwa'].initialState.build.packages);

let stores = null;
const components = {};

const render = Component => {
  ReactDOM.hydrate(
    <AppContainer>
      <Component
        core={coreModules.map(({ name, module }) => ({
          name,
          Component: module.default,
        }))}
        packages={packages}
        stores={stores}
        components={components}
      />
    </AppContainer>,
    window.document.getElementById('root'),
  );
  if (!dev)
    console.log(`>> Frontity loaded. SiteID: ${stores.build.siteId} <<`);
};

const init = async () => {
  // Adds server generated styles to emotion cache.
  hydrate(window['wp-pwa'].emotionIds);

  // Wait for activated packages.
  const pkgEntries = Object.entries(
    window['wp-pwa'].initialState.build.packages,
  );
  const pkgPromises = pkgEntries.map(([namespace, name]) =>
    importPromises({ name, namespace }),
  );
  const pkgModules = await Promise.all(pkgPromises);

  const storesProps = {};
  const envs = {};

  const addModules = pkg => {
    addPackage({ namespace: pkg.namespace, module: pkg.module });
  };

  // Add packages to worona-devs.
  coreModules.forEach(addModules);
  pkgModules.forEach(addModules);

  const mapModules = pkg => {
    if (pkg.module.Store)
      storesProps[pkg.namespace] = types.optional(pkg.module.Store, {});
    if (pkg.module.env) envs[pkg.namespace] = pkg.module.env;
    if (pkg.module.components)
      components[pkg.namespace] = pkg.module.components;
  };

  // Load MST reducers and server sagas.
  coreModules.forEach(mapModules);
  pkgModules.forEach(mapModules);

  // Create MST Stores
  const Stores = Store.props(storesProps);

  stores = Stores.create(window['wp-pwa'].initialState, {
    request,
    machine: 'server',
    ...envs,
  });
  if (dev) {
    const makeInspectable = require('mobx-devtools-mst').default;
    makeInspectable(stores);
  }
  // Add both to window
  if (typeof window !== 'undefined') window.frontity = { stores, components };
  // Start all the client sagas.
  stores.clientStarted();
  // Start App.
  render(App);
  // Inform that the client has been rendered.
  stores.clientRendered();

  // Initializes the afterCSRs.
  Object.values(stores).forEach(({ afterCsr }) => {
    if (afterCsr) afterCsr();
  });
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
