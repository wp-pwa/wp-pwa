import { types } from 'mobx-state-tree';
import GoogleAnalytics from './google-analytics';
import GoogleTagManager from './google-tag-manager';

const getKey = ({ type, id }) => `${type}_${id}`;

const Analytics = types
  .model('Analytics')
  .props({
    googleAnalytics: types.optional(GoogleAnalytics, {}),
    googleTagManager: types.optional(GoogleTagManager, {}),
    // comScore,
    customDimensionMap: types.optional(types.map(types.frozen), {}),
  })
  .views(self => ({
    customDimensions(entity) {
      return self.customDimensionMap.get(getKey(entity)) || null;
    },
  }))
  .actions(self => ({
    sendPageView() {},
    sendEvent() {},
    addCustomDimensions({ type, id, custom_analytics: customDimensions }) {
      const key = getKey({ type, id });
      if (!self.customDimensionMap.has(key)) {
        self.customDimensionMap.set(key, customDimensions);
      }
    },
  }));

export default Analytics;
