import { types } from 'mobx-state-tree';
import { dep } from 'worona-deps';

const Analytics = types
  .model('Analytics')
  .props({
    customDimensions: types.optional(types.map(types.map(types.frozen)), {}),
  })
  .actions(self => ({
    [dep('connection', 'actionTypes', 'SINGLE_SUCCEED')](action) {
      const { customDimensions } = self;
      const { entities, singleType, singleId } = action;

      if (!entities[singleType][singleId].custom_analytics) return;

      if (!customDimensions.get(singleType)) customDimensions.set(singleType, {});

      const type = customDimensions.get(singleType);

      if (!type.get(singleId)) type.set(singleId, entities[singleType][singleId].custom_analytics);
    },
  }));

export default Analytics;
