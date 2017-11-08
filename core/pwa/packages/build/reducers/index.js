import { combineReducers } from 'redux';
import * as types from '../types';

export const packages = (state = {}, action) => {
  if (action.type === types.BUILD_UPDATED && action.packages)
    return action.packages;
  return state;
}

export const siteId = (state = null, action) => {
  if (action.type === types.BUILD_UPDATED && action.siteId) return action.siteId;
  return state;
};

export const environment = (state = 'pre', action) => {
  if (action.type === types.BUILD_UPDATED && action.environment) return action.environment;
  return state;
};

export const amp = (state = false, action) => {
  if (action.type === types.BUILD_UPDATED && action.amp) return action.amp;
  return state;
};

export const ssr = (state = true, action) => {
  if (action.type === types.CLIENT_RENDERED) return false;
  return state;
};

export default combineReducers({
  ssr,
  siteId,
  environment,
  amp,
  packages,
});
