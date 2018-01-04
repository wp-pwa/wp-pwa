import { combineReducers } from 'redux';
import * as actionTypes from '../actionTypes';

export const collection = (state = {}, { type, settings }) => {
  if (type === actionTypes.SETTINGS_UPDATED)
    return { ...state, ...settings };
  return state;
};

export default combineReducers({
  collection,
});
