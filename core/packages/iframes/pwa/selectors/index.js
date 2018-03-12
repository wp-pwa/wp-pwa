import { dep } from 'worona-deps';

export const getIframes = state =>
  dep('settings', 'selectorCreators', 'getSetting')('theme', 'iframes')(state) || [];

export const getIframesForMobile = state =>
  getIframes(state).filter(({ device }) => device === 'mobile');
  
export const getIframesForTablet = state =>
  getIframes(state).filter(({ device }) => device === 'tablet');
