import { find } from 'lodash';

export const getSettings = namespace => state => state.settings.collection[namespace];
export const getSetting = (namespace, setting) => state =>
  state.settings.collection[namespace][setting];

export const getSettingsById = _id => state =>
  find(state.settings.collection, item => item._id === _id);
export const getSettingById = (_id, setting) => state =>
  find(state.settings.collection, item => item._id === _id)[setting];
