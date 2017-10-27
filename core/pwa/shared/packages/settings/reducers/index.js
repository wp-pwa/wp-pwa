import { combineReducers } from 'redux';
import * as types from '../types';

export const collection = (state = {}, { type, settings }) => {
  if (type === types.SETTINGS_UPDATED)
    return { ...state, ...settings };
  return state;
};

export default combineReducers({
  collection,
});
