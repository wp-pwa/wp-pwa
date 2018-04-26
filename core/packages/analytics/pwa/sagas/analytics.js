/* eslint-disable no-underscore-dangle */
import { takeEvery, select, call, all } from 'redux-saga/effects';
import { when } from 'mobx';
import { dep } from 'worona-deps';
import { getGaTrackingIds } from '../../shared/helpers';

let disposer;

const getSetting = (namespace, setting) =>
  dep('settings', 'selectorCreators', 'getSetting')(namespace, setting);

function virtualPageView({
  stores: {
    connection: { selectedItem },
    analytics,
  },
  trackerNames,
}) {
  const { type, id, page } = selectedItem;

  // Executes disposer if there is a pending pageview.
  if (typeof disposer === 'function') {
    disposer();
    disposer = null;
  }

  // Wait for url and title ready.
  disposer = when(
    () => selectedItem.entity.ready,
    () => {
      const { title } = selectedItem.entity.headMeta;
      const location = page ? selectedItem.entity.pagedLink(page) : selectedItem.entity.link;
      const customDimensions = analytics.getCustomDimensions({ type, id });

      const pageView = { hitType: 'pageview', title, location, ...customDimensions };

      // Send the pageview to the trackers.
      if (typeof window.ga === 'function') {
        trackerNames.forEach(trackerName => window.ga(`${trackerName}.send`, pageView));
      }
    },
  );
}

export function virtualEvent({ event, stores, trackerNames }) {
  const { connection } = stores;
  const type = `type: ${connection.selectedItem.type}`;
  const context = `context: ${connection.selectedContext.options.bar}`;

  const category = `PWA - ${event.category}`;
  const action = `PWA - ${event.action}`;
  const label = !event.label ? `${type} ${context}` : `${event.label} ${type} ${context}`;

  if (typeof window.ga === 'function') {
    trackerNames.forEach(trackerName => {
      window.ga(`${trackerName}.send`, {
        hitType: 'event',
        eventCategory: category,
        eventAction: action,
        eventLabel: label,
      });
    });
  }
}

export const eventHandlerCreator = ({ stores, trackerNames }) =>
  function* eventFilter({ event }) {
    if (event) {
      yield call(virtualEvent, { event, stores, trackerNames });
    }
  };

export const routeChangeHandlerCreator = ({ stores, trackerNames }, action) =>
  function* routeChangeHandler() {
    yield call(virtualPageView, { stores, trackerNames }, action);
  };

export default function* googleAnalyticsSagas(stores) {
  /* eslint-disable */
  (function(i, s, o, g, r, a, m) {
    i.GoogleAnalyticsObject = r;
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
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
  /* eslint-enable */

  // Retrieves trackingIds from settings.
  const analyticsSettings = yield select(getSetting('theme', 'analytics'));
  const dev = yield select(state => state.build.dev);
  const gaTrackingIds = getGaTrackingIds({ dev, analyticsSettings, format: 'pwa' });

  // Exits if there isn't any trackingId defined.
  if (!gaTrackingIds || gaTrackingIds.length === 0) return;

  // Initializes trackers and return their names.
  let trackerNames = [];
  if (typeof window.ga === 'function') {
    trackerNames = gaTrackingIds.map((trackingId, index) => {
      const name = `clientTracker${index}`;
      window.ga('create', trackingId, 'auto', name);
      return name;
    });
  }

  // Sends first pageView to trackers.
  virtualPageView({ stores, trackerNames });

  // Sends pageviews after every ROUTE_CHANGE_SUCCEED event.
  yield all([
    takeEvery(
      dep('connection', 'actionTypes', 'ROUTE_CHANGE_SUCCEED'),
      routeChangeHandlerCreator({ stores, trackerNames }),
    ),
    takeEvery('*', eventHandlerCreator({ stores, trackerNames })),
  ]);
}
