/* eslint-disable no-console, global-require, import/no-dynamic-require */
import { readFile } from 'fs-extra';
import React from 'react';
import { combineReducers } from 'redux';
import { renderToString } from 'react-dom/server';
import { extractCritical } from 'emotion-server';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import { mapValues } from 'lodash';
import { addPackage } from 'worona-deps';
import { Helmet } from 'react-helmet';
import buildModule from '../packages/build';
import settingsModule from '../packages/settings';
import App from '../shared/components/App';
import initStore from '../shared/store';
import reducers from '../shared/store/reducers';
import serverSagas from './sagas';
import { getSettings } from './settings';
import pwaTemplate from './pwa-template';
import ampTemplate from './amp-template';
import { requireModules } from './requires';

const dev = process.env.NODE_ENV !== 'production';

const { buildPath } = require(`../../.build/${process.env.MODE}/buildInfo.json`);

addPackage({ namespace: 'build', module: buildModule });
addPackage({ namespace: 'settings', module: settingsModule });

const parse = id => (Number.isFinite(parseInt(id, 10)) ? parseInt(id, 10) : id);

export default ({ clientStats }) => async (req, res) => {
  const { siteId, singleType, perPage } = req.query;
  const listType = !req.query.listType && !req.query.singleType ? 'latest' : req.query.listType;
  const listId = parse(req.query.listId) || (listType && 'post');
  const singleId = parse(req.query.singleId);
  const page = parse(req.query.page) || 1;
  const env = req.query.env === 'prod' ? 'prod' : 'pre';
  const device = req.query.device || 'mobile';

  let app;
  try {
    if (!siteId) throw new Error(`'?siteid=' query not found in ${req.originalUrl}`);

    // Get settings.
    const settings = await getSettings({ siteId, env });
    if (!settings)
      throw new Error(`Settings for ${siteId} not found in the ${env.toUpperCase()} database.`);

    // Extract activated packages array from settings.
    const activatedPackages = settings
      ? Object.values(settings)
          .filter(pkg => pkg.woronaInfo.namespace !== 'generalSite')
          .filter(pkg => pkg.woronaInfo.namespace !== 'generalApp')
          .reduce((obj, pkg) => ({ ...obj, [pkg.woronaInfo.namespace]: pkg.woronaInfo.name }), {})
      : {};

    // Load the modules.
    const pkgModules = await requireModules(Object.entries(activatedPackages));

    // Load reducers and sagas.
    const stores = {};
    pkgModules.forEach(pkg => {
      if (pkg.module.Store) pkg.module.store = pkg.module.Store.create({});
      if (pkg.module.store) stores[pkg.namespace] = pkg.module.store;
      if (pkg.module.reducers) reducers[pkg.namespace] = pkg.module.reducers(pkg.module.store);
      if (pkg.serverSaga) serverSagas[pkg.name] = pkg.serverSaga;
      addPackage({ namespace: pkg.namespace, module: pkg.module });
    });

    // Init redux store.
    const store = initStore({ reducer: combineReducers(reducers) });

    // Add settings to the state.
    store.dispatch(buildModule.actions.serverStarted());
    store.dispatch(
      buildModule.actions.buildUpdated({
        siteId,
        env,
        packages: activatedPackages,
        perPage,
        device,
      }),
    );
    store.dispatch(settingsModule.actions.settingsUpdated({ settings }));

    // Run and wait until all the server sagas have run.
    const params = { selected: { listType, listId, page, singleType, singleId }, stores };
    const startSagas = new Date();
    const sagaPromises = Object.values(serverSagas).map(saga => store.runSaga(saga, params).done);
    store.dispatch(buildModule.actions.serverSagasInitialized());
    await Promise.all(sagaPromises);
    store.dispatch(buildModule.actions.serverFinished({ timeToRunSagas: new Date() - startSagas }));

    // Generate React SSR.
    app = renderToString(
      <App store={store} packages={Object.values(activatedPackages)} stores={stores} />,
    );

    const { html, ids, css } = extractCritical(app);

    // Get static helmet strings.
    const helmet = Helmet.renderStatic();

    if (process.env.MODE === 'pwa') {
      // Flush chunk names and extract scripts, css and css<->scripts object.
      const chunkNames = flushChunkNames();
      const { cssHashRaw, scripts, stylesheets } = flushChunks(clientStats, { chunkNames });

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

      console.log('PATH', req.path);
      console.log('DYNAMIC CHUNK NAMES RENDERED', chunkNames);
      console.log('SCRIPTS SERVED', scripts);
      console.log('STYLESHEETS SERVED', stylesheets);

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
      console.log('PATH', req.path);
      res.send(ampTemplate({ helmet, css, html }));
    }
  } catch (error) {
    console.error(error);
    res.status(500);
    if (dev) {
      const RedBox = require('redbox-react').RedBoxError;
      app = renderToString(<RedBox error={error} />);
    } else {
      app = `<div>${error.message}</div>`;
    }
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
