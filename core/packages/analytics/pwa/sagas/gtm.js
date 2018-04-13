import { all, takeEvery, select, fork, call } from 'redux-saga/effects';
import { when } from 'mobx';
import { dep } from 'worona-deps';
import { getHash, getRoute } from '../../shared/helpers';

const getSetting = (namespace, setting) =>
  dep('settings', 'selectorCreators', 'getSetting')(namespace, setting);

const sendVirtualPage = virtualPage => {
  window.dataLayer.push({ event: 'virtualPageview', virtualPageview: virtualPage });
};

const sendVirtualEvent = event => {
  window.dataLayer.push({ event: 'virtualEvent', virtualEvent: event });
};

let disposer;

export function* virtualPageView({ connection, analytics }) {
  const { type, id, page } = connection.selectedItem;

  if (typeof disposer === 'function') {
    disposer();
    disposer = null;
  }

  const site = yield select(getSetting('generalSite', 'url'));

  disposer = when(
    () => connection.selectedItem.entity.ready,
    () => {
      const { title } = connection.selectedItem.entity;
      const url = page
        ? connection.selectedItem.entity.pagedLink(page)
        : connection.selectedItem.entity.link;
      const format = 'pwa';
      const route = getRoute(connection.selectedItem);
      const hash = getHash(site, connection.selectedItem);
      const customDimensions = analytics.getCustomDimensions({ type, id });

      sendVirtualPage({
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
      });
    },
  );
}

export function virtualEvent({ event, connection }) {
  const type = `type: ${connection.selectedItem.type}`;
  const context = `context: ${connection.selectedContext.options.bar}`;

  const category = `PWA - ${event.category}`;
  const action = `PWA - ${event.action}`;
  const label = !event.label ? `${type} ${context}` : `${event.label} ${type} ${context}`;

  sendVirtualEvent({
    category,
    action,
    label,
  });
}

export const succeedHandlerCreator = stores =>
  function* succeedHandler() {
    yield call(virtualPageView, stores);
  };

export const eventHandlerCreator = ({ connection }) =>
  function* eventFilter({ event }) {
    if (event) yield call(virtualEvent, { event, connection });
  };

export default function* gtmSagas(stores) {
  // Do not execute saga if analytics is disabled for this client
  const analytics = yield select(getSetting('theme', 'analytics'));
  if (analytics && analytics.disabled) return;

  // Inits data layer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });

  const dev = yield select(state => state.build.dev);

  // Anonymizes pageview
  const anonymize = (analytics && analytics.anonymize) || false;

  // Gets values for custom dimensions
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
    dev,
  };
  window.dataLayer.push({ event: 'wpPwaProperties', wpPwaProperties });

  yield fork(function* firstVirtualPageView() {
    yield call(virtualPageView, stores);
  });

  yield all([
    takeEvery(
      dep('connection', 'actionTypes', 'ROUTE_CHANGE_SUCCEED'),
      succeedHandlerCreator(stores),
    ),
    takeEvery('*', eventHandlerCreator(stores)),
  ]);
}
