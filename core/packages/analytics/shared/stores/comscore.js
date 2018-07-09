/* eslint no-underscore-dangle: ["error", { "allow": ["_comscore"] }] */
import { types, getRoot, getEnv, flow } from 'mobx-state-tree';

const GoogleTagManager = types
  .model('GoogleTagManager')
  .views(self => ({
    get ids() {
      const { settings, build } = getRoot(self);
      try {
        return settings.theme.analytics[build.channel].comScoreIds || [];
      } catch (error) {
        return [];
      }
    },
  }))
  .actions(self => {
    // Subscribe to changes in title.
    let titleMatches;

    const createTitleMatches = () =>
      typeof window !== 'undefined' &&
      getEnv(self).analytics.innerTextTracker(
        window.document.querySelector('title'),
      );

    return {
      sendPageView: flow(function* comScoreSendPageView() {
        if (!self.ids.length) return;
        if (!titleMatches) titleMatches = createTitleMatches();
        const { connection } = getRoot(self);
        yield titleMatches(connection.selectedItem.entity.headMeta.title);
        if (window.COMSCORE) {
          self.ids.forEach(id => window.COMSCORE.beacon({ c1: '2', c2: id }));
        } else {
          window._comscore = window._comscore || [];
          self.ids.forEach(id => window._comscore.push({ c1: '2', c2: id }));
        }
      }),
    };
  });

export default GoogleTagManager;
