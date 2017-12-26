import universal from 'react-universal-component';

const promiseCallbacks = {};

export const Universal = universal(
  props => import(`../../../../packages/${props.name}/src/pwa`),
  {
    minDelay: 1200,
    onLoad: (module, { isServer }, { name, namespace }) => {
      if (!isServer && promiseCallbacks[name]) {
        promiseCallbacks[name]({ name, namespace, module });
      }
    },
  },
);

export const importPromises = ({ name, namespace }) =>
  new Promise(resolve => {
    promiseCallbacks[name] = resolve;
    Universal.preload({ name, namespace });
  });
