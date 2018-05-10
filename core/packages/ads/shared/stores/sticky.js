import { types, getEnv } from 'mobx-state-tree';

export default types
  .model('Sticky')
  .props({
    isOpen: false,
    timeout: types.maybe(types.number),
    closedByUser: false,
  })
  .actions(self => {
    const { store, isClient } = getEnv(self);
    return {
      show: ({ timeout }) => {
        self.isOpen = true;
        self.timeout = timeout;
      },
      hide: ({ closedByUser }) => {
        self.isOpen = false;
        self.timeout = null;
        self.closedByUser = closedByUser;
      },
      updateTimeout: ({ timeout }) => {
        self.timeout = timeout;
      },
      afterCreate: () => {
        if (isClient) {
          if (store) {
            store.subscribe(() => {
              const action = store.getState().lastAction;

              if (self[action.type]) {
                self[action.type](action);
              }
            });
          }
        }
      },
    };
  });
