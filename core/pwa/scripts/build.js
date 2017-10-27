/* eslint-disable global-require, no-console */
const { emptyDir, writeFile } = require('fs-extra');
const path = require('path');
const webpack = require('webpack');

const dev = process.env.NODE_ENV !== 'production';

// Turn webpack into a promise.
const webpackPromise = (clientConfig, serverConfig) =>
  new Promise((resolve, reject) => {
    webpack([clientConfig, serverConfig]).run((err, stats) => {
      if (err) reject(err);
      resolve(stats);
    });
  });

const clean = async () => {
  await emptyDir('.build/pwa');
  const buildInfo = {
    buildPath: path.resolve(__dirname, '../../..'),
    nodeEnv: dev ? 'development' : 'production',
  };
  await writeFile('.build/pwa/buildInfo.json', JSON.stringify(buildInfo, null, 2));
};

const build = async () => {
  // Import proper configuration files.
  const clientConfig = dev
    ? require('../webpack/client.dev')
    : require('../webpack/client.prod');
  const serverConfig = dev
    ? require('../webpack/server.dev')
    : require('../webpack/server.prod');

  // Run webpack and wait until it finishes. Then save clientStats to a file.
  const stats = await webpackPromise(clientConfig, serverConfig);
  const clientStats = stats.toJson().children[0];
  await writeFile('.build/pwa/clientStats.json', JSON.stringify(clientStats, null, 2));

  // Return webpack stats.
  return stats;
};

module.exports = {
  build,
  clean,
};
