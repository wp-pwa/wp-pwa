/* eslint no-underscore-dangle: ["error", { "allow": ["_comscore"] }] */
import { unprotect } from 'mobx-state-tree';
import { Stores } from '../mocks';

let stores;
let innerTextTracker;
beforeEach(() => {
  // Mock innerTextTracker
  innerTextTracker = jest.fn(() => async title => {
    await new Promise(resolve => setTimeout(resolve, 100));
    window.document.querySelector('title').innerHTML = title;
  });

  stores = Stores.create({}, { analytics: { innerTextTracker } });
  unprotect(stores);
});

describe('Analytics > ComScore', () => {
  test('comScoreIds', () => {
    expect(stores.analytics.comScore.ids).toMatchSnapshot();
  });

  test('sendPageView', async () => {
    window.document.head.appendChild(window.document.createElement('title'));
    window.COMSCORE = { beacon: jest.fn() };
    await stores.analytics.comScore.sendPageView();
    expect(innerTextTracker).toHaveBeenCalled();
    expect(window.COMSCORE.beacon.mock.calls).toMatchSnapshot();
  });
});
