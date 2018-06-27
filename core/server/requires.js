/* eslint-disable global-require, import/no-dynamic-require */
import { pathExists } from 'fs-extra';

const pathExistsPromise = name =>
  new Promise((resolve, reject) => {
    pathExists(`./packages/${name}/src/${process.env.MODE}/server.js`).then(path => {
      if (path) resolve(true);
      else reject(new Error(`Module ${name} is not installed.`));
    });
  });

export default async pkgs => {
  const pathPromises = pkgs.map(([, name]) => pathExistsPromise(name));
  await Promise.all(pathPromises);
  return pkgs.map(([namespace, name]) => {
    const module = require(`../../packages/${name}/src/${process.env.MODE}/server`);
    return { name, namespace, module };
  });
}
