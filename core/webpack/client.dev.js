/* eslint-disable global-require */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const WriteFilePlugin = require('write-file-webpack-plugin'); // here so you can see what chunks are built
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const vendors = require('../vendors');

const babelrc = JSON.parse(fs.readFileSync('.babelrc', 'utf8')).env.devClient;

const config = {
  name: 'client',
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
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            ...babelrc,
          },
        },
      },
      {
        test: /\.css$/,
        use: ExtractCssChunks.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
          ],
          publicPath: `${process.env.HMR_PATH || '/'}static/`,
        }),
      },
    ],
  },
  plugins: [
    new WriteFilePlugin(),
    new ExtractCssChunks(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'], // needed to put webpack bootstrap code before chunks
      filename: '[name].js',
      minChunks: Infinity,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        MODE: JSON.stringify(process.env.MODE),
      },
    }),
    new webpack.WatchIgnorePlugin([/\.build/, /packages$/]),
    new webpack.IgnorePlugin(/vertx/),
    new LodashModuleReplacementPlugin({
      currying: true,
    }),
    new ProgressBarPlugin(),
  ],
};

if (process.env.ANALYZE) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  const Visualizer = require('webpack-visualizer-plugin');
  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: '../../analyize/pwa/client-dev-analyzer.html',
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: '../../analyize/pwa/client-dev-stats.json',
    }),
  );
  config.plugins.push(
    new Visualizer({
      filename: '../../analyize/pwa/client-dev-visualizer.html',
    }),
  );
}

module.exports = config;
