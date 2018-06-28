import { types, getRoot } from 'mobx-state-tree';
import { generateEvent } from './utils';
import { getHash, getRoute } from '../helpers';

const GoogleTagManager = types.model('GoogleTagManager').actions(self => ({
  init() {
    const { build, settings } = getRoot(self);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': Date.now(),
      event: 'gtm.js',
    });

    const { dev, packages } = build;

    // Anonymizes pageview
    const { anonymize = false } = settings.theme.analytics;

    // Gets values for custom dimensions
    const { _id: siteId, userIds } = settings.generalSite;
    const theme = settings.theme.woronaInfo.name;
    const extensions = packages.toString();
    const pageType = /^(pre)?dashboard\./.test(window.location.host)
      ? 'preview'
      : 'pwa';
    const plan = 'enterprise';

    const wpPwaProperties = {
      anonymize,
      siteId: anonymize ? 'anonymous' : siteId,
      userIds: anonymize ? 'anonymous' : userIds,
      theme: anonymize ? 'anonymous' : theme,
      extensions: anonymize ? 'anonymous' : extensions,
      plan: anonymize ? 'anonymous' : plan,
      pageType,
      dev,
    };
    window.dataLayer.push({ event: 'wpPwaProperties', wpPwaProperties });
  },
  sendPageView() {
    const { connection, analytics, settings } = getRoot(self);
    const { type, id, page, entity } = connection.selectedItem;
    const { title } = entity.headMeta;
    const site = settings.generalSite.url;
    const url = page ? entity.pagedLink(page) : entity.link;
    const format = 'pwa';
    const route = getRoute(connection.selectedItem);
    const hash = getHash(site, connection.selectedItem);
    const customDimensions = analytics.customDimensions({ type, id });

    const virtualPageview = {
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

    window.dataLayer.push({ event: 'virtualPageview', virtualPageview });
  },
  sendEvent(event) {
    const virtualEvent = generateEvent(self)(event);
    window.dataLayer.push({ event: 'virtualEvent', virtualEvent });
  },
}));

export default GoogleTagManager;
