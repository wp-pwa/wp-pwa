/* eslint-disable import/prefer-default-export */
const onLoad = script =>
  new Promise(resolve => {
    const listener = () => {
      resolve();
      script.removeEventListener('load', listener);
    };
    script.addEventListener('load', listener);
  });

export { onLoad };
