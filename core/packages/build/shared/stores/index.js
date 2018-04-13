/* eslint-disable no-console */
import { types, getParent, onAction } from 'mobx-state-tree';

const Build = types
  .model('Build')
  .props({})
  .views(self => ({
    get root() {
      return getParent(self);
    },
  }))
  .actions(self => ({
    afterCreate: () => {
      onAction(self.root, action => console.log(action));
    },
  }));

export default Build;
