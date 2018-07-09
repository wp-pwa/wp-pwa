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
    let titleMatches;

    return {
      init: flow(function* initComScore() {
        // Exits if there isn't any comScore id defined.
        if (!self.ids.length) return;

        // Subscribe to changes in title.
        titleMatches = getEnv(self).analytics.innerTextTracker(
          window.document.querySelector('title'),
        );

        // Inits '_comscore' variable with each comScore id.
        // This also sends the first pageview.
        window._comscore = window._comscore || [];
        self.ids.forEach(id => window._comscore.push({ c1: '2', c2: id }));

        // Inserts the comScore library.
        const s = window.document.createElement('script');
        s.async = true;
        s.src = `${
          window.document.location.protocol === 'https:'
            ? 'https://sb'
            : 'http://b'
        }.scorecardresearch.com/beacon.js`;

        const firstScript = window.document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(s, firstScript);

        yield new Promise(resolve => s.addEventListener('load', resolve));
      }),
      sendPageView: flow(function* comScoreSendPageView() {
        if (!self.ids.length) return;

        const { connection } = getRoot(self);
        yield titleMatches(connection.selectedItem.entity.headMeta.title);
        if (window.COMSCORE) {
          self.ids.forEach(id => window.COMSCORE.beacon({ c1: '2', c2: id }));
        }
      }),
    };
  });

export default GoogleTagManager;
