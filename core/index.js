/* eslint-disable no-console */
const argv = require('minimist')(process.argv.slice(2));
const { emptyDirSync } = require('fs-extra');
const { spawn } = require('child_process');

// Ignores invalid self-signed ssl certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

if (
  process.env.MODE !== 'pwa' &&
  process.env.MODE !== 'amp' &&
  !argv.pwa &&
  !argv.amp
) {
  throw new Error(
    'MODE not selected. Please use --pwa, --amp or an environment variable.',
  );
} else {
  process.env.MODE =
    process.env.MODE || (argv.pwa && 'pwa') || (argv.amp && 'amp');
  console.log(`> Using MODE=${process.env.MODE}`);
}

process.env.NODE_ENV = argv.p || argv.prod ? 'production' : 'development';
console.log(`> Using NODE_ENV=${process.env.NODE_ENV}`);

if (!argv.build && !!(argv.s || argv.https)) {
  process.env.HTTPS_SERVER = true;
  console.log(`> Using HTTPS_SERVER=${process.env.HTTPS_SERVER}`);
}

if (!argv.build) {
  process.env.PORT = argv.port || 3000;
  if (argv.port) console.log(`> Using PORT=${process.env.PORT}`);
}

if (argv.hmr && process.env.NODE_ENV === 'development') {
  process.env.HMR_PATH = `${argv.hmr.replace(/\/$/g, '')}/`;
  console.log(`> Using HMR_PATH=${process.env.HMR_PATH}`);
} else if ((argv.w || argv.wp) && process.env.NODE_ENV === 'development') {
  const protocol = argv.s || argv.https ? 'https://' : 'http://';
  process.env.HMR_PATH = `${protocol}localhost:${process.env.PORT}/`;
  console.log(`> Using HMR_PATH=${protocol}localhost:${process.env.PORT}/`);
}

if (argv.a || argv.analyze) {
  emptyDirSync('.build/analyize/pwa');
  process.env.ANALYZE = true;
  console.log('> Using ANALYZE=true');
  console.log('> You can load the stats in https://webpack.github.io/analyse/');
}

console.log();

const args = [`core/scripts/start.js`];

if (argv.build) args.push('--build');
else if (argv.serve) args.push('--serve');
else args.push('--start');

if (argv.d || argv.debug) args.unshift('--inspect');

spawn('node', args, { stdio: 'inherit', env: process.env });
