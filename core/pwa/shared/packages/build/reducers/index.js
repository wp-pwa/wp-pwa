import { combineReducers } from 'redux';
import { omit, find } from 'lodash';
import * as types from '../types';

export const extensions = (state = [], action) => {
  if (action.type === types.BUILD_UPDATED && action.packages)
    return omit(action.packages, ['theme']);
  return state;
};

export const theme = (state = '', action) => {
  if (action.type === types.BUILD_UPDATED && action.packages)
    return find(action.packages, (name, namespace) => namespace === 'theme');
  return state;
};

const siteId = (state = null, action) => {
  if (action.type === types.BUILD_UPDATED && action.siteId) return action.siteId;
  return state;
};

const environment = (state = 'pre', action) => {
  if (action.type === types.BUILD_UPDATED && action.environment) return action.environment;
  return state;
};

const amp = (state = false, action) => {
  if (action.type === types.BUILD_UPDATED && action.amp) return action.amp;
  return state;
};

const ssr = (state = true, action) => {
  if (action.type === types.CLIENT_RENDERED) return false;
  return state;
};

export default combineReducers({
  extensions,
  theme,
  ssr,
  siteId,
  environment,
  amp,
});
