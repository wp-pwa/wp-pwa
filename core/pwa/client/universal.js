import universal from 'react-universal-component';

const promiseCallbacks = {};

export const UniversalComponent = universal(
  props => import(`../../../packages/${props.name}/src/pwa`),
  {
    minDelay: 1200,
    onLoad: (module, info, { name, namespace }) => {
      promiseCallbacks[name]({ name, namespace, module });
    },
  },
);

export const importPromises = ({ name, namespace }) =>
  new Promise(resolve => {
    promiseCallbacks[name] = resolve;
    UniversalComponent.preload({ name, namespace });
  });
