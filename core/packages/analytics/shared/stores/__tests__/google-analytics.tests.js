import { types, unprotect } from 'mobx-state-tree';
// import GoogleAnalytics from '../google-analytics';
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
  connection: types.optional(types.frozen, {
    selectedItem: itemSingle,
    selectedContext: {
      options: {
        bar: 'single',
      },
    },
  }),
  analytics: types.optional(Analytics, {}),
});

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
    stores.analytics.googleAnalytics.sendPageView();
    expect(window.ga).toHaveBeenCalledTimes(2);

    stores.connection = { selectedItem: itemList };
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
