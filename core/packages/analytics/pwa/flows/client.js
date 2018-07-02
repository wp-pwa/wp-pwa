import { flow, addMiddleware } from 'mobx-state-tree';

const syncActionEnds = (name, callback) => (call, next) => {
  next(call);
  if (call.type === 'action' && call.name === name) callback(call);
};

export default self =>
  flow(function* AnalyticsClientFlow() {
    const { analytics, connection } = self;
    const { pwa: pwaSettings } = self.settings.theme.analytics || {};
    if (!pwaSettings) return;

    const { gaTrackingIds, gtmContainers, comScoreIds } = pwaSettings;

    // Init and send first pageView
    if (gaTrackingIds) analytics.googleAnalytics.init(gaTrackingIds);
    if (gtmContainers) analytics.googleTagManager.init();
    if (comScoreIds) analytics.comScore.init(comScoreIds);

    // Send pageviews when route has changed
    const pageViewMiddleware = syncActionEnds(
      'routeChangeSucceed',
      analytics.sendPageView,
    );
    addMiddleware(connection, pageViewMiddleware);

    yield Promise.resolve();
  });
