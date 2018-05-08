/* eslint-disable no-console, global-require, import/no-dynamic-require */
import { readFile } from 'fs-extra';
import React from 'react';
import { combineReducers } from 'redux';
import ReactDOM from 'react-dom/server';
import { extractCritical } from 'emotion-server';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import { mapValues } from 'lodash';
import { addPackage } from 'worona-deps';
import { types } from 'mobx-state-tree';
import { useStaticRendering } from 'mobx-react';
import { Helmet } from 'react-helmet';
import App from '../components/App';
import initStore from '../store';
import RootStore from '../root-store';
import { getSettings } from './settings';
import pwaTemplate from './pwa-template';
import ampTemplate from './amp-template';
import { requireModules } from './requires';
import { parseQuery } from './utils';

const buildModule = require(`../packages/build/${process.env.MODE}`);
const settingsModule = require(`../packages/settings/${process.env.MODE}`);
const analyticsModule = require(`../packages/analytics/${process.env.MODE}`);
const iframesModule = require(`../packages/iframes/${process.env.MODE}`);
const adsModule = require(`../packages/ads/${process.env.MODE}`);
const customCssModule = require(`../packages/customCss/${process.env.MODE}`);

const dev = process.env.NODE_ENV !== 'production';

const { buildPath } = require(`../../.build/${process.env.MODE}/buildInfo.json`);

export default ({ clientStats }) => async (req, res) => {
  let status = 200;
  const { siteId, perPage, initialUrl, env, device, type, id, page } = parseQuery(req.query);

  // Avoid observables in server.
  useStaticRendering(true);

  let app;
  try {
    if (!siteId) {
      status = 404;
      throw new Error(`'?siteid=' query not found in ${req.originalUrl}`);
    }

    // Get settings.
    const settings = await getSettings({ siteId, env });
    if (!settings) {
      status = 404;
      throw new Error(`Settings for ${siteId} not found in the ${env.toUpperCase()} database.`);
    }

    // Define core modules.
    const coreModules = [
      { name: 'build', namespace: 'build', module: buildModule },
      { name: 'settings', namespace: 'settings', module: settingsModule },
      { name: 'analytics', namespace: 'analytics', module: analyticsModule },
      { name: 'iframes', namespace: 'iframes', module: iframesModule },
      { name: 'ads', namespace: 'ads', module: adsModule },
      { name: 'customCss', namespace: 'customCss', module: customCssModule },
    ];

    // Extract activated packages array from settings.
    const packages = settings
      ? Object.values(settings)
          .filter(pkg => pkg.woronaInfo.namespace !== 'generalSite')
          .filter(pkg => pkg.woronaInfo.namespace !== 'generalApp')
          .reduce(
            (obj, pkg) => ({
              ...obj,
              [pkg.woronaInfo.namespace]: pkg.woronaInfo.name,
            }),
            {},
          )
      : {};

    // Load the activated modules.
    const pkgModules = await requireModules(Object.entries(packages));

    const storesProps = {};
    const reducers = {};
    const serverSagas = {};

    const addModules = pkg => {
      addPackage({ namespace: pkg.namespace, module: pkg.module });
    };

    // Add packages to worona-devs.
    coreModules.forEach(addModules);
    pkgModules.forEach(addModules);

    const mapModules = pkg => {
      if (pkg.module.Store) storesProps[pkg.namespace] = types.optional(pkg.module.Store, {});
      if (pkg.module.reducers) reducers[pkg.namespace] = pkg.module.reducers();
      if (pkg.module.serverSagas) serverSagas[pkg.name] = pkg.module.serverSagas;
    };

    // Load MST reducers and server sagas.
    coreModules.forEach(mapModules);
    pkgModules.forEach(mapModules);

    // Create Redux store.
    reducers.lastAction = (_, action) => action;
    const store = initStore({ reducer: combineReducers(reducers) });

    // Create MST Stores and pass redux as env variable.
    const Stores = RootStore.props(storesProps);
    const stores = Stores.create(
      {
        build: {
          siteId,
          channel: process.env.MODE,
          device,
          packages,
          isDev: !!req.query.dev,
          initialUrl,
          rendering: 'ssr',
          perPage: parseInt(perPage, 10),
        },
        settings,
      },
      { store, isServer: true, isClient: false },
    );
    if (typeof window !== 'undefined') window.frontity = stores;

    await stores.connection.server();

    // Notify that server is started.
    store.dispatch(buildModule.actions.serverStarted());
    stores.serverStarted();

    // Add build to the state.
    store.dispatch(
      buildModule.actions.buildUpdated({
        siteId,
        env,
        packages,
        perPage,
        device,
        amp: process.env.MODE === 'amp',
        dev: req.query.dev,
        initialUrl,
      }),
    );

    // Add settings to the state.
    store.dispatch(settingsModule.actions.settingsUpdated({ settings }));

    // Run and wait until all the server sagas have run.
    const params = {
      selectedItem: { type, id, page },
      stores,
      store,
    };
    const startSagas = new Date();
    const sagaPromises = Object.values(serverSagas).map(saga => store.runSaga(saga, params).done);
    stores.serverFlowsInitialized();
    store.dispatch(buildModule.actions.serverSagasInitialized());
    await Promise.all(sagaPromises);
    stores.serverFinished();
    store.dispatch(
      buildModule.actions.serverFinished({
        timeToRunSagas: new Date() - startSagas,
      }),
    );

    // Generate React SSR.
    const render =
      process.env.MODE === 'amp' ? ReactDOM.renderToStaticMarkup : ReactDOM.renderToString;
    app = render(
      <App
        store={store}
        core={coreModules.map(({ name, module }) => ({
          name,
          Component: module.default,
        }))}
        packages={Object.values(packages)}
        stores={stores}
      />,
    );

    const { html, ids, css } = extractCritical(app);

    // Get static helmet strings.
    const helmet = Helmet.renderStatic();

    if (process.env.MODE === 'pwa') {
      // Flush chunk names and extract scripts, css and css<->scripts object.
      const chunkNames = flushChunkNames();
      const { cssHashRaw, scripts, stylesheets } = flushChunks(clientStats, {
        chunkNames,
      });

      const publicPath = req.query.static
        ? `${req.query.static.replace(/\/$/g, '')}/static/`
        : '/static/';
      const cssHash = JSON.stringify(mapValues(cssHashRaw, cssPath => `${publicPath}${cssPath}`));
      const scriptsWithoutBootstrap = scripts.filter(script => !/bootstrap/.test(script));
      const chunksForArray = scriptsWithoutBootstrap.map(script => `'${script}'`).join(',');
      const bootstrapFileName = scripts.filter(script => /bootstrap/.test(script));
      const bootstrapString = await readFile(
        `${buildPath}/.build/${process.env.MODE}/client/${bootstrapFileName}`,
        'utf8',
      );
      const preloadScripts = scriptsWithoutBootstrap
        .map(script => `<link rel="preload" href="${publicPath}${script}" as="script">`)
        .join('\n');
      const styles = stylesheets
        .map(
          stylesheet =>
            `<link rel="stylesheet" charset="utf-8" type="text/css" href="${publicPath}${stylesheet}" />`,
        )
        .join('\n');

      console.log('URL', req.url);
      console.log('DYNAMIC CHUNK NAMES RENDERED', chunkNames);
      console.log('SCRIPTS SERVED', scripts);
      console.log('STYLESHEETS SERVED', stylesheets);

      res.status(status);
      res.send(
        pwaTemplate({
          dev,
          helmet,
          css,
          styles,
          preloadScripts,
          html,
          cssHash,
          publicPath,
          ids,
          store,
          stores,
          chunksForArray,
          bootstrapString,
        }),
      );
    } else if (process.env.MODE === 'amp') {
      console.log('URL', req.url);
      res.status(status);
      res.send(ampTemplate({ helmet, css, html }));
    }
  } catch (error) {
    console.error(error);
    if (dev) {
      const RedBox = require('redbox-react').RedBoxError;
      app = ReactDOM.renderToString(<RedBox error={error} />);
    } else {
      app = `<div>${error.message}</div>`;
    }
    res.status(status === 200 ? 500 : status);
    res.send(
      `<!doctype html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          </head>
          <body>
            ${app}
          </body>
        </html>`,
    );
  }
};
