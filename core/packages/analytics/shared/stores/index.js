import { types, getRoot, addMiddleware } from 'mobx-state-tree';
import GoogleAnalytics from './google-analytics';
import GoogleTagManager from './google-tag-manager';
import ComScore from './comscore';
import { afterAction } from './utils';

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
    afterCsr() {
      const { connection } = getRoot(self);
      // Send pageviews when route has changed
      const pageViewMiddleware = afterAction(
        'routeChangeSucceed',
        self.sendPageView,
      );
      addMiddleware(connection, pageViewMiddleware);
    },
  }));

export default Analytics;
