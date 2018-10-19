import universal from 'react-universal-component';

const promiseCallbacks = {};

const Universal = universal(
  ({ name }) => import(`../../packages/${name}/src/${process.env.MODE}/client`),
  {
    minDelay: 1200,
    onLoad: (module, { isServer }, { name, namespace }) => {
      if (!isServer && promiseCallbacks[name]) {
        promiseCallbacks[name]({ name, namespace, module });
      }
    },
    ignoreBabelRename: true,
  },
);

export const importPromises = ({ name, namespace }) =>
  new Promise(resolve => {
    promiseCallbacks[name] = resolve;
    Universal.preload({ name, namespace });
  });

export default Universal;
