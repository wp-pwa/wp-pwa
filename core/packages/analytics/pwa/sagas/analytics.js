import { takeEvery, select, call } from 'redux-saga/effects';
import { when } from 'mobx';
import { dep } from 'worona-deps';

let disposer;

const getSetting = (namespace, setting) =>
  dep('settings', 'selectorCreators', 'getSetting')(namespace, setting);

function virtualPageView({ connection, trackerNames }) {
  // Executes disposer if there is a pending pageview.
  if (disposer) {
    disposer();
    disposer = null;
  }

  // Gets single from selected.
  const { single } = connection.context.selected;

  if (!single) {
    // Single doesn't exist, so we are in the home page.
    const { title } = connection.siteInfo.home;
    const pageView = { hitType: 'pageview', title, page: '/' };
    // Send the pageview to the trackers.
    trackerNames.forEach(name => window.ga(`${name}.send`, pageView));
  } else {
    // Wait for url and title ready.
    disposer = when(
      () => single && single.meta.pretty && single.link.pretty,
      () => {
        const { title } = single.meta;
        const page = single.link.url;
        const pageView = { hitType: 'pageview', title, page };
        // Send the pageview to the trackers.
        trackerNames.forEach(name => window.ga(`${name}.send`, pageView));
      },
    );
  }
}

export const routeChangeHandlerCreator = ({ connection, trackerNames }) =>
  function* routeChangeHandler() {
    yield call(virtualPageView, { connection, trackerNames });
  };

export default function* googleAnalyticsSagas({ connection }) {
  if (!window.ga) {
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
  }

  // Retrieves trackingIds from settings.
  const analytics = yield select(getSetting('theme', 'analytics'));
  const gaTrackingIds = analytics && analytics.pwa && analytics.pwa.gaTrackingIds;

  // Exits if there isn't any trackingId defined.
  if (!gaTrackingIds || gaTrackingIds.length === 0) return;

  // Initializes trackers and return their names.
  const trackerNames = gaTrackingIds.map((trackingId, index) => {
    const name = `clientTracker${index}`;
    window.ga('create', trackingId, 'auto', name);
    return name;
  });

  // Sends first pageView to trackers.
  virtualPageView({ connection, trackerNames });

  // Sends pageviews after every ROUTE_CHANGE_SUCCEED event.
  yield takeEvery(
    dep('connection', 'actionTypes', 'ROUTE_CHANGE_SUCCEED'),
    routeChangeHandlerCreator({ connection, trackerNames }),
  );
}
