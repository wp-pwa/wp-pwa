const path = require('path');
const webpack = require('webpack');

module.exports = {
  name: 'server',
  target: 'node',
  devtool: 'source-map',
  entry: [path.resolve(__dirname, '../../init/server.js')],
  output: {
    path: path.resolve(__dirname, '../../../../.build/pwa/server'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            forceEnv: 'server',
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
  ],
};
