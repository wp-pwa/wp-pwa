import { dep } from 'worona-deps';

const emptyArray = [];

export const getIframes = state =>
  dep('settings', 'selectorCreators', 'getSetting')('theme', 'iframes')(state) || emptyArray;

export const getIframesForMobile = state =>
  getIframes(state).filter(({ device }) => device === 'mobile');

export const getIframesForTablet = state =>
  getIframes(state).filter(({ device }) => device === 'tablet');
