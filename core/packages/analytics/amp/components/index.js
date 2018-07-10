import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import GoogleAnalytics from './GoogleAnalytics';
import GoogleTagManager from './GoogleTagManager';
import ComScore from './ComScore';

const Analytics = ({
  gaIds,
  gaTrackingOptions,
  gaPageView,
  gaVars,
  gaTriggers,
  gtmIds,
  gtmVars,
  comScoreIds,
}) => (
  <Fragment>
    {gaIds.map(gaId => {
      const { sendPageViews, sendEvents } = gaTrackingOptions(gaId);
      return (
        <GoogleAnalytics
          key={gaId}
          trackingId={gaId}
          pageView={sendPageViews && gaPageView}
          vars={gaVars}
          triggers={sendEvents && gaTriggers}
        />
      );
    })}
    {gtmIds.map(gtmId => (
      <GoogleTagManager key={gtmId} containerId={gtmId} vars={gtmVars} />
    ))}
    {comScoreIds.map(comScoreId => <ComScore id={comScoreId} />)}
  </Fragment>
);

Analytics.propTypes = {
  gaIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  gaTrackingOptions: PropTypes.func.isRequired,
  gaPageView: PropTypes.shape({}).isRequired,
  gaVars: PropTypes.shape({}),
  gaTriggers: PropTypes.shape({}),
  gtmIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  gtmVars: PropTypes.shape({}),
  comScoreIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

Analytics.defaultProps = {
  gaVars: {},
  gaTriggers: {},
  gtmVars: {},
};

export default inject(({ stores: { analytics } }) => ({
  gaIds: analytics.googleAnalytics.ids,
  gaTrackingOptions: analytics.googleAnalytics.trackingOptions,
  gaPageView: analytics.googleAnalytics.pageView,
  gaVars: analytics.googleAnalytics.ampVars,
  gaTriggers: analytics.googleAnalytics.ampTriggers,
  gtmIds: analytics.googleTagManager.ids,
  gtmVars: analytics.googleTagManager.ampVars,
  comScoreIds: analytics.comScore.ids,
}))(Analytics);
