import { types, getRoot } from 'mobx-state-tree';
import { generateEvent } from '../utils';

const GoogleTagManager = types
  .model('GoogleTagManager')
  .views(self => ({
    get ids() {
      const { settings, build } = getRoot(self);
      try {
        return settings.theme.analytics[build.channel].gtmContainers || [];
      } catch (error) {
        return [];
      }
    },
    get clientProperties() {
      return getRoot(self).analytics.siteProperties;
    },
    get pageViewProperties() {
      const { analytics, connection } = getRoot(self);
      return analytics.itemProperties(connection.selectedItem);
    },
    get ampVars() {
      const { analytics, connection } = getRoot(self);
      return {
        ...analytics.siteProperties,
        ...analytics.itemProperties(connection.selectedItem),
      };
    },
  }))
  .actions(self => ({
    sendPageView() {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'virtualPageview',
        virtualPageview: self.pageViewProperties,
      });
    },
    sendEvent(event) {
      const virtualEvent = generateEvent(self)(event);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'virtualEvent', virtualEvent });
    },
  }));

export default GoogleTagManager;
