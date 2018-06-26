import { getSnapshot } from 'mobx-state-tree';
import htmlescape from 'htmlescape';

export default ({
  dev,
  helmet,
  css,
  styles,
  preloadScripts,
  html,
  cssHash,
  publicPath,
  ids,
  stores,
  chunksForArray,
  bootstrapString,
}) => `<!doctype html>
  <html ${helmet.htmlAttributes.toString()}>
    <head>
      ${dev ? '<script src="http://localhost:8098"></script>' : ''}
      <meta charset="utf-8">
      <meta name="generator" content="WordPress PWA">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      ${styles}
      ${preloadScripts}
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      ${helmet.script.toString()}
      <style>${css}</style>
    </head>
    <body ${helmet.bodyAttributes.toString()}>
      <div id="root">${html}</div>
      <script>
        if (window.document && window.document.body) window.document.body.scrollTop = 0;
        window.__CSS_CHUNKS__ = ${cssHash};
        window['wp-pwa'] = window['wp-pwa'] || {};
        window['wp-pwa'].publicPath = '${publicPath}';
        window['wp-pwa'].emotionIds = ${JSON.stringify(ids)};
        window['wp-pwa'].initialState = ${htmlescape(getSnapshot(stores))};
        var scripts = [${chunksForArray}];
        var loadScript = function(script) {
          if (document.getElementById(script)) return;
          var ref = document.getElementsByTagName('script')[0];
          var js = document.createElement('script');
          js.id = script;
          js.src = '${publicPath}' + script;
          ref.parentNode.insertBefore(js, ref);
        };
        window.addEventListener('load', function() {
          scripts.forEach(function(sc) { loadScript(sc); });
        });
        ${bootstrapString}
      </script>
    </body>
  </html>`;
