/* eslint-disable global-require, import/no-dynamic-require, import/prefer-default-export */
export const requireModules = pkgs =>
  pkgs.map(([namespace, name]) => {
    const module = require(`../../../packages/${name}/src/pwa`).default;
    try {
      // Only return serverSaga if it exists.
      const serverSaga = require(`../../../packages/${name}/src/pwa/sagas/server`).default;
      return { name, namespace, module, serverSaga };
    } catch (e) {
      return { name, namespace, module };
    }
  });
