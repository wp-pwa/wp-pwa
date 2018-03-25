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
import { useStaticRendering } from 'mobx-react';
import { Helmet } from 'react-helmet';
import App from '../components/App';
import initStore from '../store';
import { getSettings } from './settings';
import pwaTemplate from './pwa-template';
import ampTemplate from './amp-template';
import { requireModules } from './requires';
import { parseQuery } from './utils';

const buildModule = require(`../packages/build/${process.env.MODE}`);
const settingsModule = require(`../packages/settings/${process.env.MODE}`);
const analyticsModule = require(`../packages/analytics/${process.env.MODE}`);
const iframesModule = require(`../packages/iframes/${process.env.MODE}`);
const customCssModule = require(`../packages/customCss/${process.env.MODE}`);

const dev = process.env.NODE_ENV !== 'production';

const { buildPath } = require(`../../.build/${
  process.env.MODE
}/buildInfo.json`);

export default ({ clientStats }) => async (req, res) => {
  let status = 200;
  const {
    siteId,
    perPage,
    initialUrl,
    env,
    device,
    type,
    id,
    page,
  } = parseQuery(req.query);

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
      throw new Error(
        `Settings for ${siteId} not found in the ${env.toUpperCase()} database.`,
      );
    }

    // Define core modules.
    const coreModules = [
      { name: 'build', namespace: 'build', module: buildModule },
      { name: 'settings', namespace: 'settings', module: settingsModule },
      { name: 'analytics', namespace: 'analytics', module: analyticsModule },
      { name: 'iframes', namespace: 'iframes', module: iframesModule },
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

    const stores = {};
    const reducers = {};
    const serverSagas = {};

    const addModules = pkg => {
      addPackage({ namespace: pkg.namespace, module: pkg.module });
    };

    const mapModules = pkg => {
      if (pkg.module.Store) pkg.module.store = pkg.module.Store.create({});
      if (pkg.module.store) stores[pkg.namespace] = pkg.module.store;
      if (pkg.module.reducers)
        reducers[pkg.namespace] = pkg.module.reducers(pkg.module.store);
      if (pkg.module.serverSagas)
        serverSagas[pkg.name] = pkg.module.serverSagas;
    };

    // Add packages to worona-devs.
    coreModules.forEach(addModules);
    pkgModules.forEach(addModules);

    // Load reducers and sagas.
    coreModules.forEach(mapModules);
    pkgModules.forEach(mapModules);

    // Init redux store.
    const store = initStore({ reducer: combineReducers(reducers) });

    // Notify that server is started.
    store.dispatch(buildModule.actions.serverStarted());

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
    };
    const startSagas = new Date();
    const sagaPromises = Object.values(serverSagas).map(
      saga => store.runSaga(saga, params).done,
    );
    store.dispatch(buildModule.actions.serverSagasInitialized());
    await Promise.all(sagaPromises);
    store.dispatch(
      buildModule.actions.serverFinished({
        timeToRunSagas: new Date() - startSagas,
      }),
    );

    // Generate React SSR.
    const render =
      process.env.MODE === 'amp'
        ? ReactDOM.renderToStaticMarkup
        : ReactDOM.renderToString;
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
      const cssHash = JSON.stringify(
        mapValues(cssHashRaw, cssPath => `${publicPath}${cssPath}`),
      );
      const scriptsWithoutBootstrap = scripts.filter(
        script => !/bootstrap/.test(script),
      );
      const chunksForArray = scriptsWithoutBootstrap
        .map(script => `'${script}'`)
        .join(',');
      const bootstrapFileName = scripts.filter(script =>
        /bootstrap/.test(script),
      );
      const bootstrapString = await readFile(
        `${buildPath}/.build/${process.env.MODE}/client/${bootstrapFileName}`,
        'utf8',
      );
      const preloadScripts = scriptsWithoutBootstrap
        .map(
          script =>
            `<link rel="preload" href="${publicPath}${script}" as="script">`,
        )
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
          helmet,
          css,
          styles,
          preloadScripts,
          html,
          cssHash,
          publicPath,
          ids,
          store,
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
