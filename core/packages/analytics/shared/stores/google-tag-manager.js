import { types, getRoot } from 'mobx-state-tree';
import { generateEvent, getHash, getRoute } from '../utils';

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
      const { build, settings } = getRoot(self);
      const { dev, packages, channel } = build;

      // Anonymizes pageview
      const { anonymize = false } = settings.theme.analytics;

      // Gets values for custom dimensions
      const { _id: siteId, userIds } = settings.generalSite;
      const { theme } = packages;
      const extensions = Object.values(packages).join(',');
      const pageType =
        typeof window !== 'undefined' &&
        /^(pre)?dashboard\./.test(window.location.host)
          ? 'preview'
          : channel;
      const plan = 'enterprise';

      return {
        anonymize,
        siteId: anonymize ? 'anonymous' : siteId,
        userIds: anonymize ? 'anonymous' : userIds,
        theme: anonymize ? 'anonymous' : theme,
        extensions: anonymize ? 'anonymous' : extensions,
        plan: anonymize ? 'anonymous' : plan,
        pageType,
        dev,
      };
    },
    get pageViewProperties() {
      const { connection, analytics, settings, build } = getRoot(self);
      const { type, id, page, entity } = connection.selectedItem;
      const { title } = entity.headMeta;
      const site = settings.generalSite.url;
      const url = page ? entity.pagedLink(page) : entity.link;
      const format = build.channel;
      const route = getRoute(connection.selectedItem);
      const hash = getHash(site, connection.selectedItem);
      const customDimensions = analytics.customDimensions({ type, id });

      return {
        site,
        title,
        url,
        type,
        id,
        page,
        format,
        route,
        hash,
        customDimensions,
      };
    },
    get ampVars() {
      return { ...self.clientProperties, ...self.pageViewProperties };
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
