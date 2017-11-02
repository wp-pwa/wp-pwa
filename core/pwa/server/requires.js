/* eslint-disable global-require, import/no-dynamic-require, import/prefer-default-export,
no-restricted-syntax, no-restricted-globals, no-await-in-loop */
import { pathExists } from 'fs-extra';

export const requireModules = async pkgs => {
  for (const [, name] of pkgs) {
    const path = await pathExists(`./packages/${name}/src/pwa`);
    if (!path) throw new Error(`Module ${name} is not installed.`);
  }
  return pkgs.map(([namespace, name]) => {
    const module = require(`../../../packages/${name}/src/pwa`).default;
    try {
      // Only return serverSaga if it exists.
      const serverSaga = require(`../../../packages/${name}/src/pwa/sagas/server`).default;
      return { name, namespace, module, serverSaga };
    } catch (e) {
      return { name, namespace, module };
    }
  });
}
