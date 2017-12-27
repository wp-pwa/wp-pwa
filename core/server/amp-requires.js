/* eslint-disable global-require, import/no-dynamic-require, import/prefer-default-export,
no-restricted-syntax, no-restricted-globals, no-await-in-loop */
import { pathExists } from 'fs-extra';

const pathExistsPromise = name => new Promise((resolve, reject) => {
  pathExists(`./packages/${name}/src/amp/index.js`).
  then(path => {
    if (path) resolve(true);
    else reject(new Error(`Module ${name} is not installed.`));
  })
})

export const requireModules = async pkgs => {
  const pathPromises = pkgs.map(([, name]) => pathExistsPromise(name));
  await Promise.all(pathPromises);
  return pkgs.map(([namespace, name]) => {
    const module = require(`../../packages/${name}/src/amp/index.js`);
    try {
      // Only return serverSaga if it exists.
      const serverSaga = require(`../../packages/${name}/src/amp/sagas/server.js`).default;
      return { name, namespace, module, serverSaga };
    } catch (e) {
      return { name, namespace, module };
    }
  });
}
