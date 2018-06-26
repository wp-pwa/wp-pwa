import { types } from 'mobx-state-tree';

const getKey = ({ type, id }) => `${type}_${id}`;

const Analytics = types
  .model('Analytics')
  .props({
    customDimensionMap: types.optional(types.map(types.frozen), {}),
  })
  .actions(self => ({
    addCustomDimensions(rawEntities) {
      Object.keys(rawEntities).forEach(type => {
        Object.keys(rawEntities[type]).forEach(id => {
          const key = getKey({ type, id });
          const { custom_analytics: customDimensions } = rawEntities[type][id];

          if (!self.customDimensionMap.has(key)) {
            self.customDimensionMap.set(key, customDimensions);
          }
        });
      });
    },
  }))
  .views(self => ({
    customDimensions(entity) {
      return self.customDimensionMap.get(getKey(entity)) || null;
    },
  }));

export default Analytics;
