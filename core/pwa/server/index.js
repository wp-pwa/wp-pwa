/* eslint-disable no-console */
import { readFile } from 'fs-extra';
import React from 'react';
import { combineReducers } from 'redux';
import { renderToString } from 'react-dom/server';
import { extractCritical } from 'emotion-server';
import createHistory from 'history/createMemoryHistory';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import { mapValues } from 'lodash';
import { addPackage } from 'worona-deps';
import { Helmet } from 'react-helmet';
import { buildPath } from '../../../.build/pwa/buildInfo.json'; // eslint-disable-line
import buildModule from '../shared/packages/build';
import settingsModule from '../shared/packages/settings';
import App from '../shared/components/App';
import initStore from '../shared/store';
import reducers from '../shared/store/reducers';

addPackage({ namespace: 'build', module: buildModule });
addPackage({ namespace: 'settings', module: settingsModule });

export default ({ clientStats }) => async (req, res) => {
  const { siteId, environment } = req.query;

  const history = createHistory({ initialEntries: [req.path] });

  // Get settings.

  const store = initStore({ reducer: combineReducers(reducers) });

  // Add settings to the state.
  store.dispatch(buildModule.actions.serverStarted());
  store.dispatch(buildModule.actions.buildUpdated({
    siteId,
    environment,
  }));

  // Generate React SSR.
  const { html, ids, css } = extractCritical(
    renderToString(<App history={history} store={store} />),
  );

  // Get static helmet strings.
  const helmet = Helmet.renderStatic();

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
    `${buildPath}/.build/pwa/client/${bootstrapFileName}`,
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
    `<!doctype html>
      <html ${helmet.htmlAttributes.toString()}>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          ${styles}
          ${preloadScripts}
          ${helmet.title.toString()}
          ${helmet.meta.toString()}
          ${helmet.link.toString()}
          <style>${css}</style>
        </head>
        <body ${helmet.bodyAttributes.toString()}>
          <div id="root">${html}</div>
          <script>
            window.__CSS_CHUNKS__ = ${cssHash};
            window.__wp_pwa__ = {
              siteId: ${siteId ? `'${siteId}'` : null},
              static: '${publicPath}',
              emotionIds: ${JSON.stringify(ids)},
              initialState: ${JSON.stringify(store.getState())}
            };
            var scripts = [${chunksForArray}];
            var loadScript = function(script) {
              if (document.getElementById(script)) return;
              var ref = document.getElementsByTagName('script')[0];
              var js = document.createElement('script');
              js.id = script;
              js.src = '${publicPath}' + script;
              ref.parentNode.insertBefore(js, ref);
            };
            scripts.forEach(function(sc) { loadScript(sc); });
            ${bootstrapString}
          </script>
        </body>
      </html>`,
  );
};
