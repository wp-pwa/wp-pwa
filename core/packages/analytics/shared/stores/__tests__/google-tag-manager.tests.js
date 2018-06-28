import { types, unprotect } from 'mobx-state-tree';
import Analytics from '..';

const itemSingle = {
  type: 'post',
  id: 60,
  entity: {
    headMeta: { title: 'The Beauties of Gullfoss' },
    link: 'https://demo.frontity.test/the-beauties-of-gullfoss/',
  },
};

const itemList = {
  type: 'category',
  id: 7,
  page: 2,
  entity: {
    headMeta: { title: 'Photography' },
    link: 'https://demo.frontity.test/wp-cat/photography/',
    pagedLink: page =>
      `https://demo.frontity.test/wp-cat/photography/page/${page}`,
  },
};

const Stores = types.model('Stores').props({
  connection: types.optional(
    types.model('Connection', {
      selectedItem: types.optional(types.frozen, itemSingle),
      selectedContext: types.optional(types.frozen, {
        options: {
          bar: 'single',
        },
      }),
    }),
    {},
  ),
  settings: types.optional(types.frozen, {
    generalSite: {
      _id: 'site1122334455',
      userIds: ['user00', 'user01'],
      url: 'https://demo.frontity.test',
    },
    theme: {
      woronaInfo: { name: 'saturn-theme' },
      analytics: { anonymize: false },
    },
  }),
  build: types.optional(types.frozen, {
    dev: true,
    packages: ['saturn-theme', 'wp-org-connection'],
  }),
  analytics: types.optional(Analytics, {}),
});

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
    stores.connection.selectedItem = itemList;
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
