/* eslint-disable global-require */
const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const { nodeModules, babelrc } = require('./utils');
const vendors = require('../vendors');

const config = {
  name: 'client',
  mode: 'production',
  target: 'web',
  entry: {
    main: [
      ...vendors,
      path.resolve(__dirname, `../client/public-path.js`),
      path.resolve(__dirname, `../client`),
    ],
  },
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, `../../.build/${process.env.MODE}/client`),
  },
  resolve: {
    modules: nodeModules,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            ...babelrc.prodClient,
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          ExtractCssChunks.loader,
          {
            loader: 'css-loader',
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
    new ExtractCssChunks(),
    new webpack.DefinePlugin({
      'process.env': {
        MODE: JSON.stringify(process.env.MODE),
      },
    }),
    new webpack.WatchIgnorePlugin([/\.build/]),
    new webpack.IgnorePlugin(
      /vertx|redux-logger|redux-devtools-extension|redbox-react|mobx-devtools-mst/,
    ),
    new LodashModuleReplacementPlugin(),
    new ProgressBarPlugin(),
  ],
  optimization: {
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        vendor: {
          test: new RegExp(`[\\/]node_modules[\\/](${vendors.join('|')})[\\/]`),
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: false,
      }),
    ],
  },
};

if (process.env.ANALYZE) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: '../../analyze/pwa/client-prod-analyzer.html',
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: '../../analyze/pwa/client-prod-stats.json',
    }),
  );
}

module.exports = config;
