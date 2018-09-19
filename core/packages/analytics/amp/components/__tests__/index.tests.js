import React from 'react';
import renderer from 'react-test-renderer';
import { types } from 'mobx-state-tree';
import { Provider } from 'mobx-react';
import Analytics from '..';

const Stores = types.model('Stores').props({
  connection: types.frozen({
    selectedItem: { type: 'post', id: 60 },
  }),
  analytics: types.frozen({
    googleAnalytics: {
      ids: ['UA-12345678-1', 'UA-12345678-2'],
      trackingOptions: () => ({ sendPageViews: false, sendEvents: true }),
      pageView: {
        title: 'The Beauties of Gullfoss – Demo Frontity',
        url: 'https://demo.frontity.test/the-beauties-of-gullfoss/',
        cd1: 'dim1_post60',
        cd2: 'dim2_post60',
      },
      ampVars: {},
      ampTriggers: {
        openMenu: {
          on: 'click',
          selector: '.menu',
          request: 'event',
          vars: {
            eventCategory: 'AMP - Post bar',
            eventAction: 'AMP - open menu',
          },
        },
      },
    },
    googleTagManager: {
      ids: ['GTM-112233'],
      ampVars: {
        anonymize: false,
        siteId: 'site1122334455',
        userIds: ['user00', 'user01'],
        theme: 'saturn-theme',
        extensions: 'saturn-theme,wp-org-connection',
        plan: 'enterprise',
        pageType: 'pwa',
        dev: true,
        site: 'https://demo.frontity.test',
        title: 'The Beauties of Gullfoss',
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

describe('Analytics > Components', () => {
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
