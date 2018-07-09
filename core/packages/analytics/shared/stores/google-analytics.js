/* eslint no-console: ["error", { allow: ["warn"] }] */
import { types, getRoot } from 'mobx-state-tree';
import { generateEvent } from './utils';

const trackerName = id => `tracker_${id.replace(/-/g, '_')}`;

const GoogleAnalytics = types
  .model('GoogleAnalytics')
  .props({
    ampVars: types.optional(types.frozen, {}),
    ampTriggers: types.optional(types.frozen, {}),
  })
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
    sendPageView() {
      // Send the pageview to the trackers.
      if (typeof window.ga === 'function') {
        self.trackingIds.map(id => trackerName(id)).forEach(name =>
          window.ga(`${name}.send`, {
            hitType: 'pageview',
            ...self.pageView,
          }),
        );
      }
    },
    sendEvent(event) {
      const { category, action, label } = generateEvent(self)(event);
      if (typeof window.ga === 'function') {
        self.trackingIds.map(id => trackerName(id)).forEach(name => {
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
