/* eslint no-console: ["error", { allow: ["warn"] }] */
import { types, flow, getRoot } from 'mobx-state-tree';
import { generateEvent } from './utils';

const GoogleAnalytics = types
  .model('GoogleAnalytics')
  .props({
    ampVars: types.optional(types.frozen, {}),
    ampTriggers: types.optional(types.frozen, {}),
  })
  .volatile(() => ({
    trackerNames: [],
  }))
  .views(self => ({
    get trackingIds() {
      const { settings, build } = getRoot(self);
      try {
        return settings.theme.analytics[build.channel].gaTrackingIds || [];
      } catch (error) {
        return [];
      }
    },
    trackingOptions(trackingId) {
      const { settings, build } = getRoot(self);
      const analyticsSettings = settings.theme.analytics[build.channel];
      const defaultOptions = { sendPageViews: true, sendEvents: true };

      try {
        return Object.assign(
          defaultOptions,
          analyticsSettings.gaTrackingOptions[trackingId],
        );
      } catch (error) {
        console.warn(
          `Error retrieving options for tracking id ${trackingId}`,
          error,
        );
        return defaultOptions;
      }
    },
    get pageView() {
      // Get analytics and connection from the stores
      const { analytics, connection } = getRoot(self);

      // Get needed properties from selectedItem
      const { type, id, page, entity } = connection.selectedItem || {};

      // Parameters to be sent in the pageView
      const { title } = entity.headMeta;
      const location = page ? entity.pagedLink(page) : entity.link;
      const customDimensions = analytics.customDimensions({ type, id });

      return { title, location, ...customDimensions };
    },
  }))
  .actions(self => ({
    init: flow(function* googleAnalyticsInit(gaTrackingIds) {
      /* eslint-disable */
      (function(i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        (i[r] =
          i[r] ||
          function() {
            (i[r].q = i[r].q || []).push(arguments);
          }),
          (i[r].l = 1 * new Date());
        (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
      })(
        window,
        document,
        'script',
        'https://www.google-analytics.com/analytics.js',
        'ga',
      );
      /* eslint-enable */
      yield new Promise(resolve =>
        window.document
          .querySelector(
            'script[src="https://www.google-analytics.com/analytics.js"]',
          )
          .addEventListener('load', resolve),
      );

      // Initializes trackers
      self.trackerNames = gaTrackingIds.map((trackingId, index) => {
        const name = `clientTracker${index}`;
        window.ga('create', trackingId, 'auto', name);
        return name;
      });

      // Sends the first pageView
      self.sendPageView();
    }),
    sendPageView() {
      // Send the pageview to the trackers.
      if (typeof window.ga === 'function') {
        self.trackerNames.forEach(trackerName =>
          window.ga(`${trackerName}.send`, {
            hitType: 'pageview',
            ...self.pageView,
          }),
        );
      }
    },
    sendEvent(event) {
      const { category, action, label } = generateEvent(self)(event);
      if (typeof window.ga === 'function') {
        self.trackerNames.forEach(trackerName => {
          window.ga(`${trackerName}.send`, {
            hitType: 'event',
            eventCategory: category,
            eventAction: action,
            eventLabel: label,
          });
        });
      }
    },
  }));

export default GoogleAnalytics;
