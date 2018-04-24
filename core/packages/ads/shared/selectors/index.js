import { createSelector } from 'reselect';
import { dep } from 'worona-deps';

const emptyArray = [];

export const getConfig = state =>
  dep('settings', 'selectorCreators', 'getSetting')('theme', 'ads')(state);

export const getSlots = createSelector(
  getConfig,
  config => !!config && config.slots || emptyArray,
);
