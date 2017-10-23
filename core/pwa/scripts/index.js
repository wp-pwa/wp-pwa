/* eslint-disable no-console */
const argv = require('minimist')(process.argv.slice(2));
const { spawn } = require('child_process');

if (argv.serve && !argv.p && !argv.prod)
  throw new Error(
    "'Serve only' mode can't be started in development mode. Please use 'npm start' or 'npm run build -- -p && npm run serve -- -p'."
  );

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

console.log();

const args = ['core/pwa/scripts/start.js'];

if (argv.build) args.push('--build');
else if (argv.serve) args.push('--serve');

if (argv.d || argv.debug) args.unshift('--inspect');

spawn('node', args, { stdio: 'inherit', env: process.env });
