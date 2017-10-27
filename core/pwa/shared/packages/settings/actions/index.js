import * as types from '../types';

export const settingsUpdated = ({ settings }) => ({ type: types.SETTINGS_UPDATED, settings });
