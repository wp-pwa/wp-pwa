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
          id={gaId}
          pageView={sendPageViews && gaPageView}
          vars={gaVars}
          triggers={sendEvents && gaTriggers}
        />
      );
    })}
    {gtmIds.map(gtmId => (
      <GoogleTagManager key={gtmId} id={gtmId} vars={gtmVars} />
    ))}
    {comScoreIds.map(comScoreId => (
      <ComScore key={comScoreId} id={comScoreId} />
    ))}
  </Fragment>
);

Analytics.propTypes = {
  gaIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  gaTrackingOptions: PropTypes.shape({}).isRequired,
  gaPageView: PropTypes.shape({}).isRequired,
  gaVars: PropTypes.shape({}),
  gaTriggers: PropTypes.shape({}),
  gtmIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  gtmVars: PropTypes.shape({}),
  comScoreIds: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ).isRequired,
};

Analytics.defaultProps = {
  gaVars: {},
  gaTriggers: {},
  gtmVars: {},
};

export default inject(({ stores: { analytics } }) => {
  const gaIds = analytics.googleAnalytics.ids;
  const gtmIds = analytics.googleTagManager.ids;

  return {
    gaIds,
    gaTrackingOptions: gaIds.length
      ? analytics.googleAnalytics.trackingOptions
      : {},
    gaPageView: gaIds.length ? analytics.googleAnalytics.pageViewAmp : {},
    gaVars: gaIds.length ? analytics.googleAnalytics.ampVars : {},
    gaTriggers: gaIds.length ? analytics.googleAnalytics.ampTriggers : {},
    gtmIds,
    gtmVars: gtmIds.length ? analytics.googleTagManager.ampVars : {},
    comScoreIds: analytics.comScore.ids,
  };
})(Analytics);
