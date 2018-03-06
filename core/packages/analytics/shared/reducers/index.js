import { applySnapshot, getSnapshot } from 'mobx-state-tree';
import { dep } from 'worona-deps';

export default store => {
  let firstTime = true;

  return (state, { type, ...action }) => {
    if (state !== undefined && firstTime) {
      applySnapshot(store, state);
      firstTime = false;
    }

    switch (type) {
      case dep('connection', 'actionTypes', 'SINGLE_SUCCEED'):
      case dep('connection', 'actionTypes', 'LIST_SUCCEED'):
        store[type](action);
        break;
      default:
        break;
    }

    return getSnapshot(store);
  };
};
