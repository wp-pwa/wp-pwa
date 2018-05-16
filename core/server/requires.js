/* eslint-disable global-require, import/no-dynamic-require */
export default pkgs =>
  pkgs.map(([namespace, name]) => {
    try {
      const module = require(`../../packages/${name}/src/${process.env.MODE}/server`);
      return { name, namespace, module };
    } catch (error) {
      throw new Error(`Module ${name} is not installed.`);
    }
  });
