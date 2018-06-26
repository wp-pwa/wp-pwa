import Store from '../';
import rawEntities from './raw-entities.json';

describe('Analytics', () => {
  test('action - addCustomDimensions', () => {
    const analytics = Store.create();
    analytics.addCustomDimensions(rawEntities);
    expect(analytics).toMatchSnapshot();
  });

  test('view - customDimensions', () => {
    const analytics = Store.create({
      customDimensionMap: {
        post_33: {
          dimension1: 'dim1',
          dimension2: 'dim2',
        },
      },
    });

    expect(analytics.customDimensions({ type: 'post', id: 34 })).toBe(null);
    expect(
      analytics.customDimensions({ type: 'post', id: 33 }),
    ).toMatchSnapshot();
  });
});
