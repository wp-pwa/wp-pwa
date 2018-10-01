/* eslint-disable global-require */
const path = require('path');
const webpack = require('webpack');
const WriteFilePlugin = require('write-file-webpack-plugin'); // here so you can see what chunks are built
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const { nodeModules, babelrc } = require('./utils');
const vendors = require('../vendors');

const config = {
  name: 'client',
  mode: 'development',
  target: 'web',
  devtool: 'eval',
  entry: {
    main: [
      `webpack-hot-middleware/client?path=${process.env.HMR_PATH ||
        '/'}__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false`,
      'react-hot-loader/patch',
      ...vendors,
      path.resolve(__dirname, `../client/public-path.js`),
      path.resolve(__dirname, `../client`),
    ],
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, `../../.build/${process.env.MODE}/client`),
  },
  resolve: {
    modules: nodeModules,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            ...babelrc.devClient,
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
    new WriteFilePlugin(),
    new ExtractCssChunks({ hot: true }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        MODE: JSON.stringify(process.env.MODE),
      },
    }),
    new webpack.WatchIgnorePlugin([/\.build/, /packages$/]),
    new webpack.IgnorePlugin(/vertx/),
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
  },
};

if (process.env.ANALYZE) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: '../../analyize/pwa/client-dev-analyzer.html',
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: '../../analyize/pwa/client-dev-stats.json',
    }),
  );
}

module.exports = config;
