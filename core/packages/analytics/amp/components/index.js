import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { inject } from 'mobx-react';
import { dep } from 'worona-deps';
import GoogleAnalytics from './GoogleAnalytics';
import ComScore from './ComScore';
import {
  getGaTrackingIds,
  getAnonymousTitle,
  getAnonymousUrl,
  getTitle,
  getUrl,
} from '../../shared/helpers';

const Analytics = ({
  trackingIds,
  dev,
  site,
  selectedItem,
  anonymize,
  extraUrlParams,
  customDimensions,
  comScoreIds,
  themeVars,
  themeTriggers,
}) => {
  const format = 'amp';
  const routeProps = { site, selectedItem, format };

  // Gets the actual title from selectedItem.
  const { title } = selectedItem.entity.headMeta;

  // Gets the actual url from selectedItem.
  const url = getUrl({ selectedItem, format });

  return (
    <Fragment>
      {/* Anonymizes pageviews if needed */}
      <GoogleAnalytics
        title={anonymize ? getAnonymousTitle(routeProps) : getTitle(routeProps)}
        documentLocation={anonymize ? getAnonymousUrl(routeProps) : url}
        trackingId={dev ? 'UA-91312941-5' : 'UA-91312941-6'}
        extraUrlParams={extraUrlParams}
        vars={themeVars}
        triggers={themeTriggers}
      />
      {trackingIds.map(trackingId => (
        <GoogleAnalytics
          key={trackingId}
          trackingId={trackingId}
          title={title}
          documentLocation={url}
          extraUrlParams={customDimensions}
          vars={themeVars}
          triggers={themeTriggers}
        />
      ))}
      {comScoreIds.map(comScoreId => <ComScore id={comScoreId} />)}
    </Fragment>
  );
};

Analytics.propTypes = {
  trackingIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  comScoreIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  dev: PropTypes.bool.isRequired,
  site: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  anonymize: PropTypes.bool.isRequired,
  extraUrlParams: PropTypes.shape({}).isRequired,
  customDimensions: PropTypes.shape({}),
  themeVars: PropTypes.shape({}),
  themeTriggers: PropTypes.shape({}),
};

Analytics.defaultProps = {
  customDimensions: null,
  themeVars: {},
  themeTriggers: {},
};

const mapStateToProps = state => {
  const getSetting = (namespace, setting) =>
    dep('settings', 'selectorCreators', 'getSetting')(namespace, setting);

  const site = getSetting('generalSite', 'url')(state);

  // Retrieves client analytics settings for AMP.
  const analyticsSettings = getSetting('theme', 'analytics')(state);
  const { dev } = state.build;
  const trackingIds = getGaTrackingIds({ dev, analyticsSettings, format: 'amp' });
  const anonymize = (analyticsSettings && analyticsSettings.anonymize) || false;
  const comScoreIds =
    (analyticsSettings && analyticsSettings.amp && analyticsSettings.amp.comScoreIds) || [];

  // Gets the custom dimensions' values
  const siteId = getSetting('generalSite', '_id')(state);
  const userIds = getSetting('generalSite', 'userIds')(state);
  const theme = getSetting('theme', 'woronaInfo')(state).name;
  const extensions = dep('build', 'selectors', 'getPackages')(state).toString();
  const pageType = 'amp';
  const plan = 'enterprise';

  // Gets Google Analytics' triggers and vars defined in theme for AMP.
  let themeVars = {};
  let themeTriggers = {};
  try {
    themeVars = dep('theme', 'analytics', 'gaVars');
    themeTriggers = dep('theme', 'analytics', 'gaTriggers');
  } catch (e) {
    // analytics not defined in this theme
  }

  return {
    trackingIds,
    comScoreIds,
    anonymize,
    dev,
    site,
    extraUrlParams: {
      cd1: anonymize ? 'anonymous' : userIds,
      cd2: anonymize ? 'anonymous' : siteId,
      cd3: anonymize ? 'anonymous' : theme,
      cd4: anonymize ? 'anonymous' : extensions,
      // cd5: experiment,
      cd6: pageType,
      cd7: anonymize ? 'anonymous' : plan,
    },
    themeVars,
    themeTriggers,
  };
};

export default connect(mapStateToProps)(
  inject(({ connection, analytics }) => ({
    selectedItem: connection.selectedItem,
    customDimensions: analytics.getCustomDimensions({
      type: connection.selectedItem.type,
      id: connection.selectedItem.id,
    }),
  }))(Analytics),
);
