/* eslint no-console: ["error", { allow: ["warn"] }] */
import { types, getRoot } from 'mobx-state-tree';
import { generateEvent, getTrackerName } from '../utils';

const GoogleAnalytics = types
  .model('GoogleAnalytics')
  .props({
    ampVars: types.frozen({}),
    ampTriggers: types.frozen({}),
  })
  .views(self => ({
    get ids() {
      const { settings, build } = getRoot(self);
      try {
        return settings.theme.analytics[build.channel].gaTrackingIds || [];
      } catch (error) {
        return [];
      }
    },
    trackingOptions(id) {
      const { settings, build } = getRoot(self);
      const analyticsSettings = settings.theme.analytics[build.channel];
      const defaultOptions = { sendPageViews: true, sendEvents: true };

      const trackingOptions =
        analyticsSettings &&
        analyticsSettings.gaTrackingOptions &&
        analyticsSettings.gaTrackingOptions[id];

      return trackingOptions
        ? Object.assign(defaultOptions, trackingOptions)
        : defaultOptions;
    },
    get pageView() {
      // Get analytics and connection from the stores
      const { analytics, connection, build } = getRoot(self);

      // Get needed properties from selectedItem
      const { type, id, page, entity } = connection.selectedItem || {};

      // Parameters to be sent in the pageView
      const { title } = entity.headMeta;
      const location = page ? entity.pagedLink(page) : entity.link;

      const customDims = analytics.customDimensions({ type, id });
      const ampCustomDims = {};

      if (build.isAmp) {
        Object.entries(analytics.customDimensions({ type, id })).reduce(
          (cds, [key, value]) => {
            const [, number] = /^dimension(\d+)$/.exec(key);
            cds[`cd${number}`] = value;
            return cds;
          },
          ampCustomDims,
        );
      }

      return {
        title,
        location,
        ...(build.isAmp ? ampCustomDims : customDims),
      };
    },
  }))
  .actions(self => ({
    sendPageView(options = {}) {
      // Send the pageview to the trackers.
      if (typeof window.ga === 'function' && self.ids.length) {
        const pageview = { hitType: 'pageview', ...self.pageView };
        const { title, location } = options;
        if (title) pageview.title = title;
        if (location) pageview.location = location;

        self.ids
          .map(id => getTrackerName(id))
          .forEach(name => window.ga(`${name}.send`, pageview));
      }
    },
    sendEvent(event) {
      const { category, action, label } = generateEvent(self)(event);
      if (typeof window.ga === 'function') {
        self.ids.map(id => getTrackerName(id)).forEach(name => {
          window.ga(`${name}.send`, {
            hitType: 'event',
            eventCategory: category,
            eventAction: action,
            eventLabel: label,
          });
        });
      }
    },
    setAmpVars(ampVars) {
      self.ampVars = ampVars;
    },
    setAmpTriggers(ampTriggers) {
      self.ampTriggers = ampTriggers;
    },
  }));

export default GoogleAnalytics;
