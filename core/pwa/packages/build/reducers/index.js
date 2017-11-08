import { combineReducers } from 'redux';
import * as types from '../types';

const packages = (state = {}, action) => {
  if (action.type === types.BUILD_UPDATED && action.packages)
    return action.packages;
  return state;
}

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
  ssr,
  siteId,
  environment,
  amp,
  packages,
});
