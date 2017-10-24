/* eslint-disable no-console, global-require */
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
const argv = require('minimist')(process.argv.slice(2));
const clientConfig = require('./webpack/client.dev');
const serverConfig = require('./webpack/server.dev');
const { clean, build } = require('./build');
const { serve, createApp } = require('./serve');

const dev = process.env.NODE_ENV !== 'production';

const start = async () => {
  // If it's not serve (so it's build or start) clean the .build folder.
  if (!argv.serve) await clean();

  if (argv.build) {
    // Only build.
    console.log(`> Building for ${dev ? 'development' : 'production'}...`);
    await build();
    console.log('> Finished.\n');
  } else if (argv.serve) {
    // Only serve.
    await serve();
  } else if (dev) {
    // Start in DEV mode using webpack dev server with express.
    const { app, done } = await createApp();
    const compiler = webpack([clientConfig, serverConfig]);
    const clientCompiler = compiler.compilers[0];
    const options = { stats: { colors: true } };
    app.use(webpackDevMiddleware(compiler, options));
    app.use(webpackHotMiddleware(clientCompiler));
    app.use(webpackHotServerMiddleware(compiler));
    compiler.plugin('done', done);
  } else {
    // Start in PROD mode.
    console.log(`> Building for production...`);
    await build();
    console.log('> Finished. Now serving...\n');
    await serve();
  }
};

process.on('unhandledRejection', err => {
  console.log(err.stack);
  process.exit(1);
});

start();
