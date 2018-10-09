const path = require('path');
const fs = require('fs');
const { pathExistsSync } = require('fs-extra');

const nodeModules = [
  path.resolve(__dirname, '../../node_modules'),
  ...fs
    .readdirSync('packages')
    .map(dir => path.resolve(__dirname, `../../packages/${dir}/node_modules`)),
].filter(folder => pathExistsSync(folder));

const babelrc = require('../../babel.config.js').env;

// if you're specifying externals to leave unbundled, you need to tell Webpack
// to still bundle `react-universal-component`, `webpack-flush-chunks` and
// `require-universal-module` so that they know they are running
// within Webpack and can properly make connections to client modules:
const externals = nodeModules
  .map(dir => fs.readdirSync(dir))
  .reduce((final, current) => final.concat(current), [])
  .filter(
    x =>
      !/\.bin|react-universal-component|webpack-flush-chunks|lodash-es/.test(x),
  )
  .reduce((external, mod) => {
    external[mod] = `commonjs ${mod}`;
    return external;
  }, {});
externals['react-dom/server'] = 'commonjs react-dom/server';
// externals['@frontity/lazyload/lib'] = 'commonjs @frontity/lazyload/lib';

// const externals = /\/node_modules\/(?!react-universal-component|webpack-flush-chunks|lodash-es)/;

// const externals = [
//   function(context, request, callback) {
//     if (
//       /node_modules\/(?!react-universal-component|webpack-flush-chunks|lodash-es)/.test(
//         request,
//       )
//     ) {
//       return callback(null, `commonjs ${  request}`);
//     }
//     callback();
//   },
// ];

module.exports = { nodeModules, babelrc, externals };
