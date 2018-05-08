/* eslint-disable no-console */
import { types, onAction } from 'mobx-state-tree';

const dev = process.env.NODE_ENV !== 'production';

const Build = types
  .model('Build')
  .props({
    siteId: types.string,
    channel: types.enumeration(['amp', 'pwa']),
    device: types.enumeration(['mobile', 'tablet, desktop']),
    rendering: types.enumeration(['ssr', 'csr']),
    packages: types.frozen,
    isDev: types.optional(types.boolean, false),
    initialUrl: types.string,
    perPage: types.optional(types.number, 10),
  })
  .views(self => ({
    get isAmp() {
      return self.channel === 'amp';
    },
    get isPwa() {
      return self.channel === 'pwa';
    },
    isChannel: channel => self.channel === channel,
    get isMobile() {
      return self.device === 'mobile';
    },
    get isTablet() {
      return self.device === 'tablet';
    },
    get isDesktop() {
      return self.device === 'tablet';
    },
    isDevice: device => self.device === device,
    get machine() {
      return typeof window !== 'undefined' ? 'client' : 'server';
    },
    get isServer() {
      return self.machine === 'server';
    },
    get isClient() {
      return self.machine === 'client';
    },
    isMachine: machine => self.machine === machine,
    get isSsr() {
      return self.rendering === 'ssr';
    },
    get isCsr() {
      return self.rendering === 'csr';
    },
    isRendering: rendering => self.rendering === rendering,
  }))
  .actions(self => ({
    switchToCsr: () => { self.rendering = 'csr'; },
  }));

const Store = types
  .model('Store')
  .props({
    settings: types.frozen,
    build: Build,
  })
  .actions(self => ({
    updateSettings: ({ settings }) => {
      self.settings = settings;
    },
    serverStarted: () => {},
    serverFinished: () => {},
    serverFlowsInitialized: () => {},
    clientStarted: () => {},
    clientRendered: () => { self.build.rendering = 'csr'; },
    afterCreate: () => {
      if (dev) onAction(self, action => console.log(action));
    },
  }));

export default Store;
