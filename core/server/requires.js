/* eslint-disable global-require, import/no-dynamic-require, import/prefer-default-export,
no-restricted-syntax, no-restricted-globals, no-await-in-loop */
import { readdirSync, lstatSync } from 'fs';
import { join } from 'path';
import { pathExists } from 'fs-extra';

const pathExistsPromise = name =>
  new Promise((resolve, reject) => {
    pathExists(`./packages/${name}/src/${process.env.MODE}/index.js`).then(path => {
      if (path) resolve(true);
      else reject(new Error(`Module ${name} is not installed.`));
    });
  });

export const requireActivatedModules = async pkgs => {
  const pathPromises = pkgs.map(([, name]) => pathExistsPromise(name));
  await Promise.all(pathPromises);
  return pkgs.map(([namespace, name]) => {
    const module = require(`../../packages/${name}/src/${process.env.MODE}/index`);
    try {
      // Only return serverSaga if it exists.
      const serverSaga = require(`../../packages/${name}/src/${process.env.MODE}/sagas/server`)
        .default;
      return { name, namespace, module, serverSaga };
    } catch (e) {
      return { name, namespace, module };
    }
  });
};

// Get core packages from core/packages directory.
export const getCorePackages = () => {
  const path = 'core/packages/';
  const dirContent = readdirSync(path);
  return dirContent
    .filter(item => lstatSync(join(path, item)).isDirectory())
    .reduce((result, current) => ({ ...result, [current]: current }), {});
};

export const requireCoreModules = async pkgs =>
  pkgs.map(([namespace, name]) => {
    const module = require(`../packages/${name}/index`);
    try {
      // Only return serverSaga if it exists.
      const serverSaga = require(`../packages/${name}/sagas/server`).default;
      return { name, namespace, module, serverSaga };
    } catch (e) {
      return { name, namespace, module };
    }
  });
