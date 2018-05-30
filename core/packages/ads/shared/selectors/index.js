import { createSelector } from 'reselect';
import { dep } from 'worona-deps';

const emptyArray = [];

export const getConfig = state =>
  dep('settings', 'selectorCreators', 'getSetting')('theme', 'ads')(state);

export const getFills = createSelector(
  getConfig,
  config => (!!config && config.fills) || emptyArray,
);

export const areLazy = createSelector(
  getConfig,
  config =>
    !!config && !!config.settings && typeof config.settings.areLazy === 'boolean'
      ? config.settings.areLazy
      : true,
);

export const doesStickyExist = createSelector(
  getConfig,
  config =>
    !!config &&
    !!config.formats &&
    config.formats.filter(({ options }) => options && options.sticky && options.sticky.display)
      .length > 0,
);
