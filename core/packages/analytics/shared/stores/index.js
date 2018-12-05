import { types, getRoot, addMiddleware } from 'mobx-state-tree';
import GoogleAnalytics from './google-analytics';
import GoogleTagManager from './google-tag-manager';
import ComScore from './comscore';
import { afterAction, getHash } from '../utils';

const Analytics = types
  .model('Analytics')
  .props({
    googleAnalytics: types.optional(GoogleAnalytics, {}),
    googleTagManager: types.optional(GoogleTagManager, {}),
    comScore: types.optional(ComScore, {}),
  })
  .views(self => ({
    title({ type, id }) {
      return getRoot(self).connection.entity(type, id).headMeta.title;
    },
    location({ type, id, page }) {
      const { connection, build } = getRoot(self);
      const entity = connection.entity(type, id);
      const link = page ? entity.pagedLink(page) : entity.link;
      return build.isAmp ? link.replace(/\/?$/, '/amp/') : link;
    },
    customDimensions({ type, id }) {
      const { connection } = getRoot(self);
      const entity = connection.entity(type, id);
      return (entity && entity.raw && entity.raw.custom_analytics) || {};
    },
    itemProperties({ type, id, page }) {
      const { settings, build } = getRoot(self);
      const site = settings.generalSite.url;
      const title = self.title({ type, id, page });
      const url = self.location({ type, id, page });
      const format = build.channel;
      const route = typeof page === 'number' ? 'list' : 'single';
      const hash = getHash({ site, type, id, page });
      return { site, title, url, type, id, page, format, route, hash };
    },
    get siteProperties() {
      const { build, settings } = getRoot(self);
      const { dev, packages, channel, siteId } = build;

      // Anonymizes pageview
      const { anonymize = false } = settings.theme.analytics;

      // Gets values for custom dimensions
      const { userIds } = settings.generalSite;
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
  }))
  .actions(self => ({
    sendPageView() {
      self.googleAnalytics.sendPageView();
      self.googleTagManager.sendPageView();
      self.comScore.sendPageView();
    },
    sendEvent(event) {
      self.googleAnalytics.sendEvent(event);
      self.googleTagManager.sendEvent(event);
    },
    afterCsr() {
      const { connection } = getRoot(self);
      // Send pageviews when route has changed
      const pageViewMiddleware = afterAction(
        'routeChangeSucceed',
        self.sendPageView,
      );
      addMiddleware(connection, pageViewMiddleware);
    },
  }));

export default Analytics;
