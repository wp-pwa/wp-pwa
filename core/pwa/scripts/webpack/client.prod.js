/* eslint-disable global-require */
const path = require('path');
const webpack = require('webpack');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const vendors = require('../vendors');

const config = {
  name: 'client',
  target: 'web',
  entry: {
    main: [
      ...vendors,
      path.resolve(__dirname, '../../init/public-path.js'),
      path.resolve(__dirname, '../../init/client.js'),
    ]
  },
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, '../../../../.build/pwa/client'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            forceEnv: 'prodClient',
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
        }),
      },
    ],
  },
  plugins: [
    new ExtractCssChunks(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'], // needed to put webpack bootstrap code before chunks
      filename: '[name].[chunkhash].js',
      minChunks: Infinity,
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        screw_ie8: true,
        comments: false,
      },
      sourceMap: true,
    }),
    // new webpack.HashedModuleIdsPlugin(),
    new webpack.WatchIgnorePlugin([/\.build/]),
  ],
};

if (process.env.ANALYZE) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  const Visualizer = require('webpack-visualizer-plugin');
  config.plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: '../../analyize/pwa/client-analyzer.html',
    openAnalyzer: false,
    generateStatsFile: true,
    statsFilename: '../../analyize/pwa/client-stats.json',
  }));
  config.plugins.push(new Visualizer({
    filename: '../../analyize/pwa/client-visualizer.html',
  }));
}

module.exports = config;
