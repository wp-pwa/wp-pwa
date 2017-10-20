/* eslint-disable no-console */
import React from 'react';
import ReactDOM from 'react-dom/server';
import createHistory from 'history/createMemoryHistory';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import mapValues from 'lodash/mapValues';
import App from './components/App';

export default ({ clientStats }) => (req, res) => {
  const history = createHistory({ initialEntries: [req.path] });
  const app = ReactDOM.renderToString(<App history={history} />);
  const chunkNames = flushChunkNames();

  const { cssHashRaw, scripts, stylesheets } = flushChunks(clientStats, { chunkNames });

  const publicPath = req.query.static
    ? `${req.query.static.replace(/\/$/g, '')}/static/`
    : '/static/';
  const cssHash = JSON.stringify(mapValues(cssHashRaw, cssPath => `${publicPath}${cssPath}`));
  const chunksForArray = scripts.map(script => `'${script}'`).join(',');
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
      <html>
        <head>
          <meta charset="utf-8">
          <title>react-universal-component-boilerplate</title>
          ${styles}
        </head>
        <body>
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
          </script>
        </body>
      </html>`,
  );
};
