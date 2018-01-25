import { takeEvery, select, fork, call } from 'redux-saga/effects';
import { when } from 'mobx';
import { dep } from 'worona-deps';

const getSetting = (namespace, setting) =>
  dep('settings', 'selectorCreators', 'getSetting')(namespace, setting);

const sendVirtualPage = virtualPage => {
  // console.log(virtualPage);
  window.dataLayer.push({ event: 'virtualPageView', virtualPage });
};

let disposer;

export function* virtualPageView(connection) {
  if (typeof disposer === 'function') {
    disposer();
    disposer = null;
  }

  const site = yield select(getSetting('generalSite', 'url'));
  const { single, route, type, id, page } = connection.context.selected;

  if (!single) {
    sendVirtualPage({ site, title: 'home', url: `${site}`, route, type, id, page });
  } else {
    const { meta: { title }, _link: url } = single;
    disposer = when(
      () => single && single.meta.pretty && single.link.pretty,
      () => sendVirtualPage({ site, title, url, route, type, id, page }),
    );
  }
}

export const succeedHandlerCreator = ({ connection }) =>
  function* succeedHandler() {
    yield call(virtualPageView, connection);
  };

export default function* gtmSagas({ stores }) {
  // Do not execute saga if analytics is disabled for this client
  const gtm = yield select(getSetting('theme', 'gtm'));
  if (gtm && gtm.analytics && gtm.analytics.disabled) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });

  // Anonymize pageview
  const anonymize = (gtm && gtm.analytics && gtm.analytics.anonymize) || false;
  // Getting values for custom dimensions
  const siteId = yield select(getSetting('generalSite', '_id'));
  const userIds = yield select(getSetting('generalSite', 'userIds'));
  const theme = (yield select(getSetting('theme', 'woronaInfo'))).name;
  const extensions = (yield select(dep('build', 'selectors', 'getPackages'))).toString();
  const pageType = /^(pre)?dashboard\./.test(window.location.host) ? 'preview' : 'pwa';
  const plan = 'enterprise';

  const wpPwaProperties = {
    anonymize,
    siteId: anonymize ? 'anonymous' : siteId,
    userIds: anonymize ? 'anonymous' : userIds,
    theme: anonymize ? 'anonymous' : theme,
    extensions: anonymize ? 'anonymous' : extensions,
    plan: anonymize ? 'anonymous' : plan,
    pageType,
  };
  window.dataLayer.push({ event: 'wpPwaProperties', wpPwaProperties });

  yield fork(function* firstVirtualPageView() {
    yield call(virtualPageView, stores.connection);
  });

  yield takeEvery(
    dep('connection', 'actionTypes', 'ROUTE_CHANGE_SUCCEED'),
    succeedHandlerCreator(stores),
  );
}
