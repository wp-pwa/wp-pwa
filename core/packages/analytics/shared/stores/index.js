import { types } from 'mobx-state-tree';
import { dep } from 'worona-deps';

const mapCustomDimensions = (self, action) => {
  const { customDimensions } = self;
  const { entities } = action;

  const singleTypes = Object.keys(entities);

  singleTypes.forEach(type => {
    const singleIds = Object.keys(entities[type]);

    singleIds.forEach(id => {
      if (entities[type][id].custom_analytics) {
        if (!customDimensions.get(type)) {
          customDimensions.set(type, {});
        }

        if (!customDimensions.get(type).get(id)) {
          customDimensions.get(type, {}).set(id, entities[type][id].custom_analytics);
        }
      }
    });
  });
};

const Analytics = types
  .model('Analytics')
  .props({
    customDimensions: types.optional(types.map(types.map(types.frozen)), {}),
  })
  .actions(self => ({
    [dep('connection', 'actionTypes', 'SINGLE_SUCCEED')](action) {
      mapCustomDimensions(self, action);
    },
    [dep('connection', 'actionTypes', 'LIST_SUCCEED')](action) {
      mapCustomDimensions(self, action);
    },
  }))
  .views(self => ({
    getCustomDimensions({ singleType, singleId }) {
      if (singleType && singleId) {
        const type = self.customDimensions.get(singleType);

        if (type) {
          const dimensions = type.get(singleId);

          if (dimensions) {
            return dimensions;
          }
        }
      }

      return null;
    },
  }));

export default Analytics;
