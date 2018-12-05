import { types } from 'mobx-state-tree';
import Analytics from '../';

export const itemPost60 = {
  type: 'post',
  id: 60,
  entity: {
    type: 'post',
    id: 60,
    raw: {
      custom_analytics: {
        dimension1: 'dim1_post60',
        dimension2: 'dim2_post60',
      },
    },
    headMeta: { title: 'The Beauties of Gullfoss' },
    link: 'https://demo.frontity.test/the-beauties-of-gullfoss/',
  },
};

export const itemCat7 = {
  type: 'category',
  id: 7,
  page: 2,
  entity: {
    type: 'category',
    id: 7,
    raw: {
      custom_analytics: {
        dimension1: 'dim1_cat7',
        dimension2: 'dim2_cat7',
      },
    },
    headMeta: { title: 'Photography' },
    link: 'https://demo.frontity.test/wp-cat/photography/',
    pagedLink: page =>
      `https://demo.frontity.test/wp-cat/photography/page/${page}`,
  },
};

export const Stores = types.model('Stores').props({
  connection: types.optional(
    types
      .model('Connection', {
        head: types.frozen({
          title: 'The Beauties of Gullfoss &#8211; Demo Frontity',
        }),
        selectedItem: types.frozen(itemPost60),
        selectedContext: types.frozen({
          options: {
            bar: 'single',
          },
        }),
        entities: types.frozen({
          post_60: itemPost60.entity,
          category_7: itemCat7.entity,
          post_57: {
            type: 'post',
            id: 57,
            raw: {
              custom_analytics: {
                dimension1: 'dim1_post57',
                dimension2: 'dim2_post57',
              },
            },
          },
          post_54: {
            type: 'post',
            id: 54,
            raw: {
              custom_analytics: {
                dimension1: 'dim1_post54',
                dimension2: 'dim2_post54',
              },
            },
          },
        }),
      })
      .views(self => ({
        entity: (type, id) => self.entities[`${type}_${id}`],
      })),
    {},
  ),
  settings: types.frozen({
    generalSite: {
      userIds: ['user00', 'user01'],
      url: 'https://demo.frontity.test',
    },
    theme: {
      analytics: {
        anonymize: false,
        amp: {
          gaTrackingIds: ['UA-12345678-1', 'UA-12345678-2'],
          gaTrackingOptions: {
            'UA-12345678-2': {
              sendPageViews: false,
              sendEvents: true,
            },
          },
          gtmContainers: ['GTM-123456'],
        },
        pwa: {
          gaTrackingIds: ['UA-12345678-1', 'UA-12345678-2'],
          gtmContainers: ['GTM-112233'],
          comScoreIds: ['test1', 'test2'],
        },
      },
    },
  }),
  build: types.frozen({
    siteId: 'site1122334455',
    dev: true,
    channel: 'pwa',
    packages: {
      theme: 'saturn-theme',
      connection: 'wp-org-connection',
    },
  }),
  analytics: types.optional(Analytics, {}),
});
