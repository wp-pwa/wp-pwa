import { unprotect } from 'mobx-state-tree';
import { Stores, itemCat7 } from '../mocks';

let stores;
beforeEach(() => {
  stores = Stores.create({});
  unprotect(stores);
});

describe('Analytics > GoogleTagManager', () => {
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

  test('view - clientProperties', () => {
    expect(
      stores.analytics.googleTagManager.clientProperties,
    ).toMatchSnapshot();
  });

  test('view - ampVars', () => {
    expect(stores.analytics.googleTagManager.ampVars).toMatchSnapshot();
  });

  test('view - ids', () => {
    stores.build = { dev: true, channel: 'pwa' };
    expect(stores.analytics.googleTagManager.ids).toMatchSnapshot();
    stores.build = { dev: true, channel: 'amp' };
    expect(stores.analytics.googleTagManager.ids).toMatchSnapshot();
  });
});
