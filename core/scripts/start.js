/* eslint-disable no-console, global-require */
const argv = require('minimist')(process.argv.slice(2));
const { clean, build } = require('./build');
const { serve, createApp } = require('./serve');

const dev = process.env.NODE_ENV !== 'production';

const start = async () => {
  // If it's not serve (so it's build or start) clean the .build folder.
  if (!argv.serve) await clean();

  if (argv.build) {
    // Only build.
    console.log(
      `> Building ${process.env.MODE} for ${
        dev ? 'development' : 'production'
      }...\n`,
    );
    await build();
    console.log('> Finished.\n');
  } else if (argv.serve) {
    // Only serve.
    await serve();
  } else if (dev) {
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
    const clientConfig = require('../webpack/client.dev');
    const serverConfig = require('../webpack/server.dev');
    // Start in DEV mode using webpack dev server with express.
    const { app, done } = await createApp();
    const compiler = webpack([clientConfig, serverConfig]);
    const clientCompiler = compiler.compilers[0];
    const options = { stats: { colors: true, progress: true } };
    app.use(webpackDevMiddleware(compiler, options));
    app.use(webpackHotMiddleware(clientCompiler));
    app.use(webpackHotServerMiddleware(compiler, { chunkName: 'm' }));
    compiler.hooks.done.tap('RunningServer', done);
  } else {
    // Start in PROD mode.
    console.log(`> Building ${process.env.MODE} for production...`);
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
