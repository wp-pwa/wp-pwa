import { Stores } from '../mocks';

describe('Analytics', () => {
  test('view - customDimensions', () => {
    const stores = Stores.create();
    expect([
      stores.analytics.customDimensions({ type: 'post', id: 57 }),
      stores.analytics.customDimensions({ type: 'post', id: 54 }),
      stores.analytics.customDimensions({ type: 'post', id: 34 }),
    ]).toMatchSnapshot();
  });
});
