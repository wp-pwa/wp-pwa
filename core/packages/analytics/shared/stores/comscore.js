/* eslint no-underscore-dangle: ["error", { "allow": ["_comscore"] }] */
import { types, getRoot, getEnv, flow } from 'mobx-state-tree';

const GoogleTagManager = types
  .model('GoogleTagManager')
  .props({
    comScoreIds: types.optional(
      types.array(types.union(types.string, types.number)),
      [],
    ),
  })
  .actions(self => {
    let titleMatches;

    return {
      init: flow(function* initComScore(comScoreIds) {
        self.comScoreIds = comScoreIds;

        // Subscribe to changes in title.
        titleMatches = getEnv(self).analytics.innerTextTracker(
          window.document.querySelector('title'),
        );

        // Exits if there isn't any comScore id defined.
        if (!comScoreIds || comScoreIds.length === 0) return;

        // Inits '_comscore' variable with each comScore id.
        // This also sends the first pageview.
        window._comscore = window._comscore || [];
        comScoreIds.forEach(id => window._comscore.push({ c1: '2', c2: id }));

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
        const { connection } = getRoot(self);
        yield titleMatches(connection.selectedItem.entity.headMeta.title);
        if (window.COMSCORE) {
          self.comScoreIds.forEach(id =>
            window.COMSCORE.beacon({ c1: '2', c2: id }),
          );
        }
      }),
    };
  });

export default GoogleTagManager;
