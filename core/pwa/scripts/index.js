/* eslint-disable no-console */
const argv = require('minimist')(process.argv.slice(2));
const { emptyDirSync } = require('fs-extra');
const { spawn } = require('child_process');

process.env.NODE_ENV = argv.p || argv.prod ? 'production' : 'development';
console.log(`> Using NODE_ENV=${process.env.NODE_ENV}`);

if (!argv.build && !!(argv.s || argv.https)) {
  process.env.HTTPS_SERVER = true;
  console.log(`> Using HTTPS_SERVER=${process.env.HTTPS_SERVER}`);
}

if (argv.hmr) {
  process.env.HMR_PATH = `${argv.hmr.replace(/\/$/g, '')}/`;
  console.log(`> Using HMR_PATH=${process.env.HMR_PATH}`);
} else if (argv.w || argv.wp) {
  const protocol = argv.s || argv.https ? 'https://' : 'http://';
  process.env.HMR_PATH = `${protocol}localhost:3000/`;
  console.log(`> Using HMR_PATH=${protocol}localhost:3000/`);
}

if (argv.a || argv.analyze) {
  emptyDirSync('.build/analyize/pwa')
  process.env.ANALYZE = true;
  console.log('> Using ANALYZE=true');
  console.log('> You can load the stats in https://webpack.github.io/analyse/')
}

console.log();

const args = ['core/pwa/scripts/start.js'];

if (argv.build) args.push('--build');
else if (argv.serve) args.push('--serve');

if (argv.d || argv.debug) args.unshift('--inspect');

spawn('node', args, { stdio: 'inherit', env: process.env });
