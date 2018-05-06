import { types, getEnv } from 'mobx-state-tree';
import * as actionTypes from '../actionTypes';

export default types
  .model('Settings')
  .props({
    modules: types.optional(types.frozen, {}),
  })
  .views(self => ({
    getSetting(namespace, setting) {
      return self.modules[namespace][setting];
    },
  }))
  .actions(self => {
    const { store, isClient } = getEnv(self);

    return {
      [actionTypes.SETTINGS_UPDATED]({ settings }) {
        self.modules = settings;
      },
      afterCreate: () => {
        if (!isClient) {
          if (store)
            store.subscribe(() => {
              const action = store.getState().lastAction;

              if (self[action.type]) {
                self[action.type](action);
              }
            });
        }
      },
    };
  });
