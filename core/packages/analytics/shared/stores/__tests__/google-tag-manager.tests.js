import { unprotect } from 'mobx-state-tree';
import { Stores, itemCat7 } from '../mocks';

let stores;
beforeEach(() => {
  stores = Stores.create({});
  unprotect(stores);
});

describe('Analytics > GoogleTagManager', () => {
  test('init', async () => {
    Date.now = jest.fn(() => 1530202469377);
    await stores.analytics.googleTagManager.init();
    expect(window.dataLayer).toMatchSnapshot();
  });

  test('sendPageView', () => {
    window.dataLayer = [];
    stores.analytics.googleTagManager.sendPageView();
    stores.connection.selectedItem = itemCat7;
    stores.analytics.googleTagManager.sendPageView();
    expect(window.dataLayer).toMatchSnapshot();
  });

  test('sendEvent', () => {
    const event = {
      category: 'test/category',
      action: 'test/action',
      label: 'test/label',
    };

    window.dataLayer = [];
    stores.analytics.googleTagManager.sendEvent(event);
    expect(window.dataLayer).toMatchSnapshot();
  });
});
