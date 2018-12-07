import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'mobx-react';
import { types } from 'mobx-state-tree';
import Analytics from '..';

const Stores = types.model('Stores').props({
  build: types.frozen({
    isPwa: true,
    channel: 'pwa',
    packages: 'saturn-theme,wp-org-connection',
  }),
  connection: types.frozen({
    selectedItem: { type: 'post', id: 60 },
  }),
  analytics: types.frozen({
    customDimensions: () => ({
      dimension1: 'dim1_post60',
      dimension2: 'dim2_post60',
    }),
    googleAnalytics: {
      ids: ['UA-12345678-1', 'UA-12345678-2'],
    },
    googleTagManager: {
      ids: ['GTM-112233'],
      clientProperties: {
        anonymize: false,
        siteId: 'site1122334455',
        userIds: ['user00', 'user01'],
        theme: 'saturn-theme',
        extensions: 'saturn-theme,wp-org-connection',
        plan: 'enterprise',
        pageType: 'pwa',
        dev: true,
      },
      pageViewProperties: {
        site: 'https://demo.frontity.test',
        title: 'The Beauties of Gullfoss – Demo Frontity',
        url: 'https://demo.frontity.test/the-beauties-of-gullfoss/',
        type: 'post',
        id: 60,
        format: 'pwa',
        route: 'single',
        hash: 'ZO0H2I9kJ0arOdstZdG',
        customDimensions: {
          dimension1: 'dim1_post60',
          dimension2: 'dim2_post60',
        },
      },
    },
    comScore: {
      ids: ['test1', 'test2'],
    },
  }),
});

describe('Analytics > PWA Components', () => {
  it('renders correctly', () => {
    const stores = Stores.create();
    const tree = renderer.create(
      <Provider stores={stores}>
        <Analytics />
      </Provider>,
    );
    expect(tree).toMatchSnapshot();
  });
});
