import { combineReducers } from 'redux';
import * as actionTypes from '../actionTypes';

const isOpen = (state = false, action) => {
  switch (action.type) {
    case actionTypes.STICKY_HAS_SHOWN:
      return true;
    case actionTypes.STICKY_HAS_HIDDEN:
      return false;
    default:
      return state;
  }
};

const timeout = (state = null, action) => {
  switch (action.type) {
    case actionTypes.STICKY_HAS_SHOWN:
      return action.timeout;
    case actionTypes.STICKY_UPDATE_TIMEOUT:
      return action.timeout;
    case actionTypes.STICKY_HAS_HIDDEN:
      return null;
    default:
      return state;
  }
};

const closedByUser = (state = false, action) => {
  switch (action.type) {
    case actionTypes.STICKY_HAS_HIDDEN:
      return action.closedByUser;
    default:
      return state;
  }
};

export default combineReducers({
  isOpen,
  timeout,
  closedByUser,
});
