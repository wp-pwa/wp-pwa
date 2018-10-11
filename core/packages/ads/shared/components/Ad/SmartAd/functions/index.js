/* eslint-disable */
import setup from 'raw-loader!babel-loader?forceEnv=devClient!./setup';
import call from 'raw-loader!babel-loader?forceEnv=devClient!./call';
/* eslint-enable */

export { setup, call };
