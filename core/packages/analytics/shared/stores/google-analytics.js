import { types, flow, getRoot } from 'mobx-state-tree';
import { generateEvent } from './utils';

const GoogleAnalytics = types
  .model('GoogleAnalytics')
  .props({
    trackerNames: types.optional(types.array(types.string), []),
  })
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
    }),
    sendPageView() {
      // Get analytics and connection from the stores
      const { analytics, connection } = getRoot(self);

      // Get needed properties from selectedItem
      const {
        selectedItem: { type, id, page, entity },
      } = connection;

      // Parameters to be sent in the pageView
      const { title } = entity.headMeta;
      const location = page ? entity.pagedLink(page) : entity.link;
      const customDimensions = analytics.customDimensions({ type, id });

      const pageView = {
        hitType: 'pageview',
        title,
        location,
        ...customDimensions,
      };

      // Send the pageview to the trackers.
      if (typeof window.ga === 'function') {
        self.trackerNames.forEach(trackerName =>
          window.ga(`${trackerName}.send`, pageView),
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
