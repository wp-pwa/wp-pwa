import { unprotect } from 'mobx-state-tree';
import { Stores, itemPost60, itemCat7 } from '../mocks';

let stores;
beforeEach(() => {
  stores = Stores.create({});
  unprotect(stores);
});

describe('Analytics > GoogleAnalytics', () => {
  test('init', async () => {
    // The Google Analytics snippet inserts its script before the first one,
    // so there must be an script in the DOM mock.
    const firstScript = window.document.createElement('script');
    window.document.body.appendChild(firstScript);

    window.ga = jest.fn();
    const gaTrackingIds = ['UA-123456', 'UA-778899'];
    await stores.analytics.googleAnalytics.init(gaTrackingIds);
    expect(stores.analytics.googleAnalytics).toMatchSnapshot();
    expect(window.ga).toHaveBeenCalledTimes(4);
    expect(window.ga.mock.calls).toMatchSnapshot();
  });

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
});
