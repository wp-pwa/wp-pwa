import { unprotect } from 'mobx-state-tree';
import { Stores, itemPost60, itemCat7 } from '../mocks';

let stores;
beforeEach(() => {
  stores = Stores.create({});
  unprotect(stores);
});

describe('Analytics > GoogleAnalytics', () => {
  test('sendPageView', () => {
    window.ga = jest.fn();
    stores.analytics.googleAnalytics.trackerNames = ['test1', 'test2'];

    stores.connection.selectedItem = itemPost60;
    stores.analytics.googleAnalytics.sendPageView();
    expect(window.ga).toHaveBeenCalledTimes(2);

    stores.connection.selectedItem = itemCat7;
    stores.analytics.googleAnalytics.sendPageView();
    expect(window.ga).toHaveBeenCalledTimes(4);

    expect(window.ga.mock.calls).toMatchSnapshot();
  });

  test('sendEvent', () => {
    const event = {
      category: 'test/category',
      action: 'test/action',
      label: 'test/label',
    };

    window.ga = jest.fn();
    stores.analytics.googleAnalytics.trackerNames = ['test1', 'test2'];
    stores.analytics.googleAnalytics.sendEvent(event);
    expect(window.ga).toHaveBeenCalledTimes(2);
    expect(window.ga.mock.calls).toMatchSnapshot();
  });

  test('trackingIds', () => {
    stores.build = { dev: true, channel: 'pwa' };
    expect(stores.analytics.googleAnalytics.trackingIds).toMatchSnapshot();
    stores.build = { dev: true, channel: 'amp' };
    expect(stores.analytics.googleAnalytics.trackingIds).toMatchSnapshot();
  });

  test('trackingOptions', () => {
    const { trackingOptions } = stores.analytics.googleAnalytics;
    let trackingIds;

    stores.build = { dev: true, channel: 'pwa' };
    ({ trackingIds } = stores.analytics.googleAnalytics);
    expect(trackingIds.map(id => trackingOptions(id))).toMatchSnapshot();

    stores.build = { dev: true, channel: 'amp' };
    ({ trackingIds } = stores.analytics.googleAnalytics);
    expect(trackingIds.map(id => trackingOptions(id))).toMatchSnapshot();
  });
});
