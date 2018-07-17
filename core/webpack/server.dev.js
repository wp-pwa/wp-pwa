/* eslint-disable global-require */
const path = require('path');
const webpack = require('webpack');
const WriteFilePlugin = require('write-file-webpack-plugin');
const { nodeModules, babelrc, externals } = require('./utils');

const config = {
  name: 'server',
  target: 'node',
  // devtool: 'source-map',
  devtool: 'eval',
  entry: [path.resolve(__dirname, `../server`)],
  externals,
  output: {
    path: path.resolve(__dirname, `../../.build/${process.env.MODE}/server`),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
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
            ...babelrc.server,
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
    new WriteFilePlugin(),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        MODE: JSON.stringify(process.env.MODE),
      },
    }),
    new webpack.WatchIgnorePlugin([/\.build/, /packages$/]),
    new webpack.IgnorePlugin(/vertx/),
  ],
};

if (process.env.ANALYZE) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  const Visualizer = require('webpack-visualizer-plugin');
  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: `../../analyize/${
        process.env.MODE
      }/server-dev-analyzer.html`,
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: `../../analyize/${process.env.MODE}/server-dev-stats.json`,
    }),
  );
  config.plugins.push(
    new Visualizer({
      filename: `../../analyize/${process.env.MODE}/server-dev-visualizer.html`,
    }),
  );
}

module.exports = config;
