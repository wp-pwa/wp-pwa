/* eslint-disable no-console, global-require */
const path = require('path');
const { emptyDir, writeFile } = require('fs-extra');
const express = require('express');
const webpack = require('webpack');
const noFavicon = require('express-no-favicons');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
const clientConfig = require('./webpack/client.dev');
const serverConfig = require('./webpack/server.dev');
const clientConfigProd = require('./webpack/client.prod');
const serverConfigProd = require('./webpack/server.prod');

const dev = process.env.NODE_ENV === 'development';

const start = async () => {
  await emptyDir('.build/pwa');
  const buildInfo = {
    buildPath: path.resolve(__dirname, '../../..'),
    nodeEnv: dev ? 'development' : 'production',
  };
  await writeFile('.build/pwa/buildInfo.json', JSON.stringify(buildInfo, null, 2));

  const app = express();
  app.use(noFavicon());
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  let isBuilt = false;

  const done = () =>
    !isBuilt &&
    app.listen(3000, () => {
      isBuilt = true;
      console.log('BUILD COMPLETE -- Listening @ http://localhost:3000');
    });

  if (dev) {
    const compiler = webpack([clientConfig, serverConfig]);
    const clientCompiler = compiler.compilers[0];
    const options = { stats: { colors: true } };

    app.use('/static', express.static(path.resolve(__dirname, '../../../.build/pwa/client')));
    app.use(webpackDevMiddleware(compiler, options));
    app.use(webpackHotMiddleware(clientCompiler));
    app.use(webpackHotServerMiddleware(compiler));

    compiler.plugin('done', done);
  } else {
    webpack([clientConfigProd, serverConfigProd]).run((err, stats) => {
      const clientStats = stats.toJson().children[0];
      const serverRender = require('../../../.build/pwa/server/main.js').default; // eslint-disable-line

      app.use('/static', express.static(clientConfigProd.output.outputPath));
      app.use(serverRender({ clientStats }));

      done();
    });
  }
};

start();
