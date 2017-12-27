/* eslint-disable import/prefer-default-export */
import * as actionTypes from '../actionTypes';

export const settingsUpdated = ({ settings }) => ({ type: actionTypes.SETTINGS_UPDATED, settings });
