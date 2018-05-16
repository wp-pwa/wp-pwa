import { types, getParent, getEnv } from 'mobx-state-tree';
import { parse, format } from 'url';

export default types
  .model('Build')
  .props({
    siteId: types.string,
    channel: types.enumeration(['amp', 'pwa']),
    device: types.enumeration(['mobile', 'tablet', 'desktop']),
    rendering: types.enumeration(['ssr', 'csr']),
    packages: types.frozen,
    isDev: types.optional(types.boolean, false),
    urlFromQuery: types.maybe(types.string),
    perPage: types.number,
  })
  .views(self => ({
    get root() {
      return getParent(self);
    },
    get initialUrl() {
      if (
        self.urlFromQuery &&
        (!parse(self.urlFromQuery).host || !parse(self.urlFromQuery).protocol)
      ) {
        const siteUrl = self.root.settings.generalSite.url;
        const { protocol, host } = parse(siteUrl);
        return format({ protocol, host, pathname: self.urlFromQuery });
      }
      return self.urlFromQuery;
    },
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
      return self.device === 'desktop';
    },
    isDevice: device => self.device === device,
    get isServer() {
      return getEnv(self).machine === 'server';
    },
    get isClient() {
      return getEnv(self).machine === 'client';
    },
    isMachine: machine => getEnv(self).machine === machine,
    get isSsr() {
      return self.rendering === 'ssr';
    },
    get isCsr() {
      return self.rendering === 'csr';
    },
    isRendering: rendering => self.rendering === rendering,
  }))
  .actions(self => ({
    switchToCsr: () => {
      self.rendering = 'csr';
    },
  }));
