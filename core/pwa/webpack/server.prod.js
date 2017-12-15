/* eslint-disable global-require */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

// if you're specifying externals to leave unbundled, you need to tell Webpack
// to still bundle `react-universal-component`, `webpack-flush-chunks` and
// `require-universal-module` so that they know they are running
// within Webpack and can properly make connections to client modules:
const externals = fs
  .readdirSync(path.resolve(__dirname, '../../../node_modules'))
  .filter(x => !/\.bin|react-universal-component|webpack-flush-chunks/.test(x))
  .reduce((external, mod) => {
    external[mod] = `commonjs ${mod}`;
    return external;
  }, {});

externals['react-dom/server'] = 'commonjs react-dom/server';

const config = {
  name: 'server',
  target: 'node',
  entry: [path.resolve(__dirname, '../server')],
  output: {
    path: path.resolve(__dirname, '../../../.build/pwa/server'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  externals,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            forceEnv: 'prodServer',
          },
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'css-loader/locals',
            options: {
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.WatchIgnorePlugin([/\.build/]),
    new webpack.IgnorePlugin(/vertx/),
  ],
};

if (process.env.ANALYZE) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  const Visualizer = require('webpack-visualizer-plugin');
  config.plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: '../../analyize/pwa/server-analyzer.html',
    openAnalyzer: false,
    generateStatsFile: true,
    statsFilename: '../../analyize/pwa/server-stats.json',
  }));
  config.plugins.push(new Visualizer({
    filename: '../../analyize/pwa/server-visualizer.html',
  }));
}

module.exports = config;
