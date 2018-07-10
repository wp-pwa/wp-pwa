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
    stores.analytics.googleAnalytics.sendEvent(event);
    expect(window.ga).toHaveBeenCalledTimes(2);
    expect(window.ga.mock.calls).toMatchSnapshot();
  });

  test('ids', () => {
    stores.build = { channel: 'pwa' };
    expect(stores.analytics.googleAnalytics.ids).toMatchSnapshot();
    stores.build = { channel: 'amp' };
    expect(stores.analytics.googleAnalytics.ids).toMatchSnapshot();
  });

  test('trackingOptions', () => {
    const { trackingOptions } = stores.analytics.googleAnalytics;
    let ids;

    stores.build = { channel: 'pwa' };
    ({ ids } = stores.analytics.googleAnalytics);
    expect(ids.map(id => trackingOptions(id))).toMatchSnapshot();

    stores.build = { channel: 'amp' };
    ({ ids } = stores.analytics.googleAnalytics);
    expect(ids.map(id => trackingOptions(id))).toMatchSnapshot();
  });
});
