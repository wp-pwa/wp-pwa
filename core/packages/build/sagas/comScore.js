/* eslint no-underscore-dangle: ["error", { "allow": ["_comscore"] }] */
import { takeEvery, select, call } from 'redux-saga/effects';
import { when } from 'mobx';
import { dep } from 'worona-deps';

const getSetting = (namespace, setting) =>
  dep('settings', 'selectorCreators', 'getSetting')(namespace, setting);

let disposer;

const waitForChangesInText = domElement => {
  // Stores resolve and reject methods from promises.
  let resolver;
  let rejecter;

  // Text to match.
  let innerTextToMatch;

  // Initializes the observer.
  const observer = new window.MutationObserver(
    () => domElement.innerText === innerTextToMatch && resolver(),
  );
  observer.observe(domElement, { childList: true });

  // Returns a function that returns a promise that resolves when the innerText attribute
  // of the domElement matches the one passed as argument.
  return async innerText => {
    // Rejects a pending Promise
    if (rejecter) {
      rejecter();
      rejecter = null;
    }

    // Checks first if innerText is already the same.
    if (innerText === domElement.innerText) return;

    // Sets innerText to match.
    innerTextToMatch = innerText;

    // Resolves when the the innerText of the observed element is equals to innerTextToMatch.
    await new Promise((resolve, reject) => {
      resolver = resolve;
      rejecter = reject;
    });
  };
};

// Subscribes to changes in title.
const titleMatches = waitForChangesInText(window.document.getElementsByTagName('title')[0]);

export function* virtualPageView(connection, comScoreIds) {
  // Executes disposer if there is a pending pageview.
  if (typeof disposer === 'function') {
    disposer();
    disposer = null;
  }

  // Gets single from selected item.
  const { single } = connection.context.selected;

  if (!single) {
    // Single doesn't exist, so we are in the home page.
    const { title } = connection.siteInfo.home;
    yield call(titleMatches, title);
    comScoreIds.forEach(id => window.COMSCORE.beacon({ c1: '2', c2: id }));
  } else {
    // Waits for the correct url and title and then sends beacons.
    disposer = when(
      () => single && single.meta.pretty && single.link.pretty,
      async () => {
        const { title } = single.meta;
        await titleMatches(title);
        comScoreIds.forEach(id => window.COMSCORE.beacon({ c1: '2', c2: id }));
      },
    );
  }
}

export const routeChangeHandlerCreator = ({ connection, comScoreIds }) =>
  function* routeChangeHandler() {
    yield call(virtualPageView, connection, comScoreIds);
  };

export default function* comScoreSagas({ connection }) {
  // Gets comScore ids from settings.
  const analytics = yield select(getSetting('theme', 'analytics'));
  const comScoreIds = analytics && analytics.pwa && analytics.pwa.comScoreIds;

  // Exits if there isn't any comScore id defined.
  if (!comScoreIds || comScoreIds.length === 0) return;

  // Inits '_comscore' variable with each comScore id.
  // This also sends the first pageview.
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
