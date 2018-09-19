/* eslint-disable no-console */
import { types, onAction } from 'mobx-state-tree';
import Build from './build';

const dev = process.env.NODE_ENV !== 'production';

const Store = types
  .model('Store')
  .props({
    settings: types.frozen(),
    build: Build,
  })
  .actions(self => ({
    updateSettings: ({ settings }) => {
      self.settings = settings;
    },
    serverStarted: () => {},
    serverFinished: () => {},
    flowsInitialized: () => {},
    clientStarted: () => {},
    clientRendered: () => {
      self.build.rendering = 'csr';
    },
    afterCreate: () => {
      if (dev) onAction(self, action => console.log(action));
    },
  }));

export default Store;
