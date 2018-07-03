import { types, getRoot } from 'mobx-state-tree';
import GoogleAnalytics from './google-analytics';
import GoogleTagManager from './google-tag-manager';
import ComScore from './comscore';

const Analytics = types
  .model('Analytics')
  .props({
    googleAnalytics: types.optional(GoogleAnalytics, {}),
    googleTagManager: types.optional(GoogleTagManager, {}),
    comScore: types.optional(ComScore, {}),
  })
  .views(self => ({
    customDimensions({ type, id }) {
      const { connection } = getRoot(self);
      const entity = connection.entity(type, id);
      return (entity && entity.raw && entity.raw.custom_analytics) || null;
    },
  }))
  .actions(self => ({
    sendPageView() {
      self.googleAnalytics.sendPageView();
      self.googleTagManager.sendPageView();
      self.comScore.sendPageView();
    },
    sendEvent(event) {
      self.googleAnalytics.sendEvent(event);
      self.googleTagManager.sendEvent(event);
    },
  }));

export default Analytics;
