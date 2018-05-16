import { types, getEnv } from 'mobx-state-tree';
import { dep } from 'worona-deps';

const mapCustomDimensions = (self, action) => {
  const { customDimensions } = self;
  const { entities } = action;

  const entityTypes = Object.keys(entities);

  entityTypes.forEach(type => {
    const entityIds = Object.keys(entities[type]);

    entityIds.forEach(id => {
      if (entities[type][id].custom_analytics) {
        if (!customDimensions.get(entities[type][id].type)) {
          customDimensions.set(entities[type][id].type, {});
        }

        if (!customDimensions.get(entities[type][id].type).get(id)) {
          customDimensions
            .get(entities[type][id].type, {})
            .set(id, entities[type][id].custom_analytics);
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
    [dep('connection', 'actionTypes', 'ENTITY_SUCCEED')](action) {
      mapCustomDimensions(self, action);
    },
    [dep('connection', 'actionTypes', 'LIST_SUCCEED')](action) {
      mapCustomDimensions(self, action);
    },
  }))
  .views(self => ({
    getCustomDimensions({ type, id }) {
      if (type && id) {
        const typeList = self.customDimensions.get(type);

        if (typeList) {
          const dimensions = typeList.get(id.toString());

          if (dimensions) {
            return dimensions;
          }
        }
      }

      return null;
    },
  }));

export default Analytics;
