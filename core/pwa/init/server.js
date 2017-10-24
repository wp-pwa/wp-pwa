/* eslint-disable no-console */
import { readFile } from 'fs-extra';
import React from 'react';
import ReactDOM from 'react-dom/server';
import createHistory from 'history/createMemoryHistory';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import { mapValues } from 'lodash';
import { Helmet } from 'react-helmet';
import { buildPath } from '../../../.build/pwa/buildInfo.json'; // eslint-disable-line
import App from './components/App';

export default ({ clientStats }) => async (req, res) => {
  const history = createHistory({ initialEntries: [req.path] });

  // Generate React SSR.
  const app = ReactDOM.renderToString(<App history={history} />);

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
      css => `<link rel="stylesheet" charset="utf-8" type="text/css" href="${publicPath}${css}" />`,
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
        </head>
        <body ${helmet.bodyAttributes.toString()}>
          <div id="root">${app}</div>
          <script>
            window.__CSS_CHUNKS__ = ${cssHash};
            window.__wp_pwa__ = {
              static: '${publicPath}'
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
