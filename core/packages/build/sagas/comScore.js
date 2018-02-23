/* eslint no-underscore-dangle: ["error", { "allow": ["_comscore"] }] */
import { takeEvery, select, call } from 'redux-saga/effects';
import { when } from 'mobx';
import { dep } from 'worona-deps';

const getSetting = (namespace, setting) =>
  dep('settings', 'selectorCreators', 'getSetting')(namespace, setting);

let disposer;

export function* virtualPageView(connection, comScoreIds) {
  // Executes disposer if there is a pending pageview.
  if (typeof disposer === 'function') {
    disposer();
    disposer = null;
  }

  const site = yield select(getSetting('generalSite', 'url'));

  // Gets single from selected item.
  const { single } = connection.context.selected;

  if (!single) {
    // Single doesn't exist, so we are in the home page.
    const { title } = connection.siteInfo.home;
    comScoreIds.forEach(id => window.COMSCORE.beacon({ c1: '2', c2: id, c7: site, c8: title }));
  } else {
    // Waits for the correct url and title and then sends beacons.
    disposer = when(
      () => single && single.meta.pretty && single.link.pretty,
      () => {
        const { title } = single.meta;
        const page = single.link.url;
        comScoreIds.forEach(id => window.COMSCORE.beacon({ c1: '2', c2: id, c7: page, c8: title }));
      },
    );
  }
}

export const routeChangeHandlerCreator = ({ connection, comScoreIds }) =>
  function* routeChangeHandler() {
    yield call(virtualPageView, connection, comScoreIds);
  };

export default function* comScoreSagas({ connection }) {
  // Gets comScore ids for this client
  const analytics = yield select(getSetting('theme', 'analytics'));
  const comScoreIds = analytics && analytics.pwa && analytics.pwa.comScoreIds;

  // Exits if there isn't any comScore id defined.
  if (!comScoreIds || comScoreIds.length === 0) return;

  // Inits '_comscore' variable with each comScore id.
  // This allows comScore library to send the first pageview.
  window._comscore = window._comscore || [];
  comScoreIds.forEach(id => window._comscore.push({ c1: '2', c2: id }));

  // Inserts the comScore library.
  const s = document.createElement('script');
  s.async = true;
  s.src = `${
    document.location.protocol === 'https:' ? 'https://sb' : 'http://b'
  }.scorecardresearch.com/beacon.js`;
  const el = document.getElementsByTagName('script')[0];
  el.parentNode.insertBefore(s, el);

  // Sends an event to each comScore id after every ROUTE_CHANGE_SUCCEED.
  yield takeEvery(
    dep('connection', 'actionTypes', 'ROUTE_CHANGE_SUCCEED'),
    routeChangeHandlerCreator({ connection, comScoreIds }),
  );
}
