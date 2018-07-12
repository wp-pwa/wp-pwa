/* eslint-disable react/no-danger */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose, getContext, mapProps } from 'recompose';
import GoogleTagManager from './GoogleTagManager';
import GoogleAnalytics from './GoogleAnalytics';
import ComScore from './ComScore';

const Analytics = ({
  gtmIds,
  gtmClientProperties,
  gtmPageViewProperties,
  gaIds,
  gaCustomDimensions,
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
  wpPwaProperties: ${JSON.stringify(gtmClientProperties, null, 2)},
});
window.dataLayer.push({
  event: 'virtualPageview',
  virtualPageview: ${JSON.stringify(gtmPageViewProperties, null, 2)},
});`,
      }}
    />
    {/* <GoogleTagManager key="GTM-K3S2BMT" id="GTM-K3S2BMT" /> */}
    {gtmIds.map(id => <GoogleTagManager key={id} id={id} />)}
    {gaIds.map(id => (
      <GoogleAnalytics key={id} id={id} customDimensions={gaCustomDimensions} />
    ))}
    {comScoreIds.map(id => <ComScore key={id} id={id} />)}
  </Fragment>
);

Analytics.propTypes = {
  gtmIds: PropTypes.arrayOf(PropTypes.string),
  gtmClientProperties: PropTypes.shape({}),
  gtmPageViewProperties: PropTypes.shape({}),
  gaIds: PropTypes.arrayOf(PropTypes.string),
  gaCustomDimensions: PropTypes.shape({}),
  comScoreIds: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ),
};

Analytics.defaultProps = {
  gtmIds: [],
  gtmClientProperties: {},
  gtmPageViewProperties: {},
  gaIds: [],
  gaCustomDimensions: {},
  comScoreIds: [],
};

const injectNotObserver = fn =>
  compose(
    getContext({ mobxStores: PropTypes.shape({}) }),
    mapProps(({ mobxStores }) => fn(mobxStores)),
  );

export default injectNotObserver(({ stores: { analytics, connection } }) => ({
  gtmIds: analytics.googleTagManager.ids,
  gtmClientProperties: analytics.googleTagManager.clientProperties,
  gtmPageViewProperties: analytics.googleTagManager.pageViewProperties,
  gaIds: analytics.googleAnalytics.ids,
  gaCustomDimensions: analytics.customDimensions(connection.selectedItem),
  comScoreIds: analytics.comScore.ids,
}))(Analytics);
