import { types } from 'mobx-state-tree';

const Store = types.model('Store').props({
  settings: types.frozen,
}).actions(self => ({
  updateSettings: ({ settings }) => { self.settings = settings; },
}));

export default Store;
