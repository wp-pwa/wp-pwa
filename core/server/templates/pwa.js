import { getSnapshot } from 'mobx-state-tree';
import htmlescape from 'htmlescape';

export default ({
  dev,
  helmet,
  styleTags,
  app,
  styles,
  preloadScripts,
  cssHash,
  publicPath,
  initialSelectedItem,
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
      ${styleTags}
    </head>
    <body ${helmet.bodyAttributes.toString()}>
      <div id="root">${app}</div>
      <script>
        if (window.document && window.document.body) window.document.body.scrollTop = 0;
        window.__CSS_CHUNKS__ = ${cssHash};
        window['wp-pwa'] = window['wp-pwa'] || {};
        window['wp-pwa'].initialSelectedItem = ${htmlescape(
          initialSelectedItem,
        )};
        window['wp-pwa'].publicPath = '${publicPath}';
        window['wp-pwa'].initialState = ${htmlescape(getSnapshot(stores))};
        var scripts = [${chunksForArray}];
        var loadScript = function(script) {
          if (document.getElementById(script)) return;
          var ref = document.getElementsByTagName('head')[0];
          var js = document.createElement('script');
          js.id = script;
          js.src = '${publicPath}' + script;
          ref.appendChild(js);
        };
        scripts.forEach(function(sc) { loadScript(sc); });
        ${bootstrapString}
      </script>
    </body>
  </html>`;
