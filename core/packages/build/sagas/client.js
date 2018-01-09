import { takeEvery, select, fork, call } from 'redux-saga/effects';
import { when } from 'mobx';
import { dep } from 'worona-deps';

const getSetting = (namespace, setting) =>
  dep('settings', 'selectorCreators', 'getSetting')(namespace, setting);

const getUrlAndTitle = ({ type, id, taxonomy, slug, avatar, alt }) => {
  let url = '';
  let title = '';
  if (type === 'post') {
    url += `?p=${id}`;
    title += `Post - ${id}`;
  } else if (taxonomy === 'category') {
    url += `?cat=${id}`;
    title += `Category - ${id}`;
  } else if (taxonomy === 'tag') {
    url += `?tag=${slug}`;
    title += `Tag - ${slug}`;
  } else if (avatar) {
    url += `?author=${slug}`;
    title += `Author - ${slug}`;
  } else if (taxonomy === 'archive') {
    url += `?m=${id}`;
    title += `Archive - ${id}`;
  } else if (type === 'page') {
    url += `?page_id=${id}`;
    title += `Page - ${id}`;
  } else if (taxonomy === 'search') {
    url += `?s=${id}`;
    title += `Search - ${id}`;
  } else if (alt) {
    url += `?attachment_id=${id}`;
    title += `Attachment - ${id}`;
  } else {
    title += 'Home';
  }
  return { url, title };
};

let disposer;

const sendVirtualPage = ({ title, url, siteName, siteUrl }) => {
  const virtualPage = {
    title: `${siteName} - ${title}`,
    url: `${siteUrl}${url}`,
  };
  window.dataLayer.push({ event: 'virtualPageView', virtualPage });
};

export function* virtualPageView(connection) {
  const siteName = yield select(getSetting('generalSite', 'name'));
  const siteUrl = yield select(getSetting('generalSite', 'url'));

  const { single } = connection.context.selected;
  if (disposer) {
    disposer();
    disposer = null;
  }

  if (!single) {
    sendVirtualPage({ title: 'Home', url: '', siteName, siteUrl });
  } else {
    disposer = when(
      () => single && single.meta.pretty && single.link.pretty,
      () => sendVirtualPage({ ...getUrlAndTitle(single), siteName, siteUrl }),
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

  // Getting values for custom dimensions
  const siteId = yield select(getSetting('generalSite', '_id'));
  const userIds = yield select(getSetting('generalSite', 'userIds'));
  const theme = (yield select(getSetting('theme', 'woronaInfo'))).name;
  const extensions = (yield select(dep('build', 'selectors', 'getPackages'))).toString();
  const pageType = /^(pre)?dashboard\./.test(window.location.host) ? 'preview' : 'pwa';
  const plan = 'enterprise';

  const values = { siteId, userIds, theme, extensions, pageType, plan };
  window.dataLayer.push({ event: 'pageViewDimensions', values });

  yield fork(function* firstVirtualPageView() {
    yield call(virtualPageView, stores.connection);
  });

  yield takeEvery(
    dep('connection', 'actionTypes', 'ROUTE_CHANGE_SUCCEED'),
    succeedHandlerCreator(stores),
  );
}
