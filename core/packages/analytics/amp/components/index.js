import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import GoogleAnalytics from './GoogleAnalytics';
import GoogleTagManager from './GoogleTagManager';
import ComScore from './ComScore';

const Analytics = ({
  gaTrackingIds,
  gaTrackingOptions,
  gaPageView,
  gaVars,
  gaTriggers,
  gtmContainerIds,
  gtmVars,
  comScoreIds,
}) => (
  <Fragment>
    {gaTrackingIds.map(trackingId => {
      const { sendPageViews, sendEvents } = gaTrackingOptions(trackingId);
      return (
        <GoogleAnalytics
          key={trackingId}
          trackingId={trackingId}
          pageView={sendPageViews && gaPageView}
          vars={gaVars}
          triggers={sendEvents && gaTriggers}
        />
      );
    })}
    {gtmContainerIds.map(containerId => (
      <GoogleTagManager
        key={containerId}
        containerId={containerId}
        vars={gtmVars}
      />
    ))}
    {comScoreIds.map(comScoreId => <ComScore id={comScoreId} />)}
  </Fragment>
);

Analytics.propTypes = {
  gaTrackingIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  gaTrackingOptions: PropTypes.func.isRequired,
  gaPageView: PropTypes.shape({}).isRequired,
  gaVars: PropTypes.shape({}),
  gaTriggers: PropTypes.shape({}),
  gtmContainerIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  gtmVars: PropTypes.shape({}),
  comScoreIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

Analytics.defaultProps = {
  gaVars: {},
  gaTriggers: {},
  gtmVars: {},
};

export default inject(({ stores: { analytics } }) => ({
  gaTrackingIds: analytics.googleAnalytics.trackingIds,
  gaTrackingOptions: analytics.googleAnalytics.trackingOptions,
  gaPageView: analytics.googleAnalytics.pageView,
  gaVars: analytics.googleAnalytics.ampVars,
  gaTriggers: analytics.googleAnalytics.ampTriggers,
  gtmContainerIds: analytics.googleTagManager.containerIds,
  gtmVars: analytics.googleTagManager.ampVars,
  comScoreIds: analytics.comScore.comScoreIds,
}))(Analytics);
