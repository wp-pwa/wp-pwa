import React from 'react';
import renderer from 'react-test-renderer';
import { types } from 'mobx-state-tree';
import { Provider } from 'mobx-react';
import Analytics from '..';

const Stores = types.model('Stores').props({
  build: types.frozen({
    isAmp: true,
    channel: 'amp',
    packages: 'saturn-theme,wp-org-connection',
  }),
  connection: types.frozen({
    selectedItem: { type: 'post', id: 60 },
  }),
  analytics: types.frozen({
    googleAnalytics: {
      ids: ['UA-12345678-1', 'UA-12345678-2'],
      trackingOptions: id => ({
        sendPageViews: id !== 'UA-12345678-1',
        sendEvents: true,
      }),
      pageViewAmp: {
        title: 'The Beauties of Gullfoss – Demo Frontity',
        documentLocation:
          'https://demo.frontity.test/the-beauties-of-gullfoss/amp/',
        extraUrlParams: {
          cd1: 'dim1_post60',
          cd2: 'dim2_post60',
        },
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
        pageType: 'amp',
        dev: true,
        site: 'https://demo.frontity.test',
        title: 'The Beauties of Gullfoss',
        url: 'https://demo.frontity.test/the-beauties-of-gullfoss/amp/',
        type: 'post',
        id: 60,
        format: 'amp',
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

describe('Analytics > AMP Components', () => {
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
