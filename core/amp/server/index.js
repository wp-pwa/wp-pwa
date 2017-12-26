/* eslint-disable no-console, global-require */
import React from 'react';
import { combineReducers } from 'redux';
import { renderToString } from 'react-dom/server';
import { extractCritical } from 'emotion-server';
import { addPackage } from 'worona-deps';
import { Helmet } from 'react-helmet';
import { buildPath } from '../../../.build/pwa/buildInfo.json'; // eslint-disable-line
import buildModule from '../packages/build';
import settingsModule from '../packages/settings';
import App from '../shared/components/App';
import initStore from '../shared/store';
import reducers from '../shared/store/reducers';
import serverSagas from './sagas';
import { getSettings } from './settings';
import { requireModules } from './requires';

const dev = process.env.NODE_ENV !== 'production';

addPackage({ namespace: 'build', module: buildModule });
addPackage({ namespace: 'settings', module: settingsModule });

const parse = id => Number.isFinite(parseInt(id, 10)) ? parseInt(id, 10) : id;

export default () => async (req, res) => {
  const { siteId, singleType, perPage } = req.query;
  const listType = !req.query.listType && !req.query.singleType ? 'latest' : req.query.listType;
  const listId = parse(req.query.listId) || listType && 'post';
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

    const { html, css } = extractCritical(app);

    // Get static helmet strings.
    const helmet = Helmet.renderStatic();

    console.log('PATH', req.path);

    res.send(
      `<!doctype html>
        <html amp>
          <head>
            <meta charset="utf-8">
            <script async src='https://cdn.ampproject.org/v0.js'></script>
            <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
            <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
            <style amp-custom>${css}</style>
          </head>
          <body ${helmet.bodyAttributes.toString()}>
            ${html}
          </body>
        </html>`,
    );
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
