import { flow } from 'mobx-state-tree';

export default self =>
  flow(function* AnalyticsClientFlow() {
    const { analytics } = self;
    const { pwa: pwaSettings } = self.settings.theme.analytics || {};
    if (!pwaSettings) return;

    const { gaTrackingIds, gtmContainers, comScoreIds } = pwaSettings;

    yield Promise.all([
      gaTrackingIds
        ? analytics.googleAnalytics.init(gaTrackingIds)
        : Promise.resolve(),
      gtmContainers
        ? analytics.googleTagManager.init(gtmContainers)
        : Promise.resolve(),
      comScoreIds ? analytics.comScore.init(comScoreIds) : Promise.resolve(),
    ]);

    // Sends first pageView
    analytics.googleAnalytics.sendPageView();

    yield Promise.resolve();
  });
