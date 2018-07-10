/* eslint-disable react/no-danger */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import GoogleTagManager from './GoogleTagManager';
import GoogleAnalytics from './GoogleAnalytics';
import ComScore from './ComScore';

const Analytics = ({
  gtmIds,
  gtmClientProperties,
  gtmPageViewProperties,
  gaIds,
  comScoreIds,
}) => (
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
    {gtmIds.map(id => <GoogleTagManager key={id} id={id} />)}
    {gaIds.map(id => <GoogleAnalytics key={id} id={id} />)}
    {comScoreIds.map(id => <ComScore key={id} id={id} />)}
  </Fragment>
);

Analytics.propTypes = {
  gtmIds: PropTypes.arrayOf(PropTypes.string),
  gtmClientProperties: PropTypes.shape({}),
  gtmPageViewProperties: PropTypes.shape({}),
  gaIds: PropTypes.arrayOf(PropTypes.string),
  comScoreIds: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ),
};

Analytics.defaultProps = {
  gtmIds: [],
  gtmClientProperties: {},
  gtmPageViewProperties: {},
  gaIds: [],
  comScoreIds: [],
};

export default inject(({ stores: { analytics } }) => ({
  gtmIds: analytics.googleTagManager.ids,
  gtmClientProperties: analytics.googleTagManager.clientProperties,
  gtmPageViewProperties: analytics.googleTagManager.pageViewProperties,
  gaIds: analytics.googleAnalytics.ids,
  comScoreIds: analytics.comScore.ids,
}))(Analytics);
