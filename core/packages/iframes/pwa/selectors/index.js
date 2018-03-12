/* eslint-disable import/prefer-default-export */
import { dep } from 'worona-deps';

export const getIframesSettings = state =>
  dep('settings', 'selectorCreators', 'getSetting')('theme', 'iframes')(state);
