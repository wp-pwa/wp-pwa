/* eslint-disable import/prefer-default-export */
import universal from 'react-universal-component';

const Disqus = universal(import('./Disqus'));

export { Disqus as Comments };
