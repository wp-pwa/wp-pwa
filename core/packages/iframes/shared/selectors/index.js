import { createSelector } from 'reselect';
import { dep } from 'worona-deps';

const emptyArray = [];

export const getIframes = createSelector(
  state => state,
  state =>
    dep('settings', 'selectorCreators', 'getSetting')('theme', 'iframes')(state) || emptyArray,
);

export const getIframesForMobile = createSelector(
  state => getIframes(state),
  iframes => iframes.filter(({ device }) => device === 'mobile'),
);

export const getIframesForTablet = createSelector(
  state => getIframes(state),
  iframes => iframes.filter(({ device }) => device === 'tablet'),
);
