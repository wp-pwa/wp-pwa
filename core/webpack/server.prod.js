/* eslint-disable global-require */
const path = require('path');
const webpack = require('webpack');
const { nodeModules, babelrc, externals } = require('./utils');

const config = {
  name: 'server',
  mode: 'production',
  target: 'node',
  entry: {
    m: [path.resolve(__dirname, `../server`)],
  },
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
        use: {
          loader: 'babel-loader',
          options: {
            compact: true,
            babelrc: false,
            ...babelrc.server,
          },
        },
      },
      {
        test: /\.css$/,
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
        MODE: JSON.stringify(process.env.MODE),
      },
    }),
    new webpack.WatchIgnorePlugin([/\.build/]),
    new webpack.IgnorePlugin(/vertx/),
  ],
};

if (process.env.ANALYZE) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: `../../analyze/${
        process.env.MODE
      }/server-prod-analyzer.html`,
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: `../../analyze/${process.env.MODE}/server-prod-stats.json`,
    }),
  );
}

module.exports = config;
