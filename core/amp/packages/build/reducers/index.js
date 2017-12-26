import { combineReducers } from 'redux';
import * as actionTypes from '../actionTypes';

export const packages = (state = {}, action) => {
  if (action.type === actionTypes.BUILD_UPDATED && action.packages) return action.packages;
  return state;
};

export const siteId = (state = null, action) => {
  if (action.type === actionTypes.BUILD_UPDATED && action.siteId) return action.siteId;
  return state;
};

export const env = (state = 'pre', action) => {
  if (action.type === actionTypes.BUILD_UPDATED && action.env) return action.env;
  return state;
};

export const amp = (state = false, action) => {
  if (action.type === actionTypes.BUILD_UPDATED && action.amp) return action.amp;
  return state;
};

export const ssr = (state = true, action) => {
  if (action.type === actionTypes.CLIENT_RENDERED) return false;
  return state;
};

export const server = (state = true, action) => {
  if (action.type === actionTypes.CLIENT_STARTED) return false;
  return state;
};

export const perPage = (state = 10, action) => {
  if (action.type === actionTypes.BUILD_UPDATED && action.perPage) return action.perPage;
  return state;
};

export const device = (state = 'mobile', action) => {
  if (action.type === actionTypes.BUILD_UPDATED && action.device) return action.device;
  return state;
};

export default combineReducers({
  ssr,
  server,
  siteId,
  env,
  amp,
  packages,
  perPage,
  device,
});
