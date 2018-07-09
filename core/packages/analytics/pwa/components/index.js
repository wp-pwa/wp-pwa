/* eslint-disable react/no-danger */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import GoogleTagManager from './GoogleTagManager';
import GoogleAnalytics from './GoogleAnalytics';
import ComScore from './ComScore';

const Analytics = ({
  gtmContainers,
  gtmClientProperties,
  gtmPageViewProperties,
  gaTrackingIds,
  comScoreIds,
  isAmp,
}) => {
  if (isAmp) return null;

  return (
    <Fragment>
      <script
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'gtm.start': Date.now(),
  event: 'gtm.js',
});
window.dataLayer.push({
  event: 'wpPwaProperties',
  wpPwaProperties: ${JSON.stringify(gtmClientProperties)},
});
window.dataLayer.push({
  event: 'virtualPageview',
  virtualPageview: ${JSON.stringify(gtmPageViewProperties)},
});`,
        }}
      />
      {/* <GoogleTagManager key="GTM-K3S2BMT" id="GTM-K3S2BMT" /> */}
      {gtmContainers.map(id => <GoogleTagManager key={id} id={id} />)}
      {gaTrackingIds.map(id => <GoogleAnalytics key={id} id={id} />)}
      {comScoreIds.map(id => <ComScore key={id} id={id} />)}
    </Fragment>
  );
};

Analytics.propTypes = {
  gtmContainers: PropTypes.arrayOf(PropTypes.string),
  gtmClientProperties: PropTypes.shape({}),
  gtmPageViewProperties: PropTypes.shape({}),
  gaTrackingIds: PropTypes.arrayOf(PropTypes.string),
  comScoreIds: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ),
  isAmp: PropTypes.bool.isRequired,
};

Analytics.defaultProps = {
  gtmContainers: [],
  gtmClientProperties: {},
  gtmPageViewProperties: {},
  gaTrackingIds: [],
  comScoreIds: [],
};

export default inject(({ stores: { analytics, build } }) => ({
  gtmContainers: analytics.googleTagManager.containerIds,
  gtmClientProperties: analytics.googleTagManager.clientProperties,
  gtmPageViewProperties: analytics.googleTagManager.pageViewProperties,
  gaTrackingIds: analytics.googleAnalytics.trackingIds,
  comScoreIds: analytics.comScore.ids,
  isAmp: build.isAmp,
}))(Analytics);
