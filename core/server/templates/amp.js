export default ({ helmet, css, html }) => `<!doctype html>
  <html amp>
    <head>
      <meta charset="utf-8">
      <meta name="generator" content="WordPress PWA">
      <script async src='https://cdn.ampproject.org/v0.js'></script>
      <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
      <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      ${helmet.script.toString()}
      <style amp-custom>${css}</style>
    </head>
    <body ${helmet.bodyAttributes.toString()}>
      ${html}
    </body>
  </html>`;
