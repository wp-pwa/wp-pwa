import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { inject } from 'mobx-react';
import { dep } from 'worona-deps';
import GoogleAnalytics from './GoogleAnalytics';
import {
  getGaTrackingIds,
  getAnonymousTitle,
  getAnonymousUrl,
  getTitle,
  getUrl,
} from '../../shared/helpers';

const Analytics = ({ trackingIds, dev, site, selected, anonymize, extraUrlParams }) => {
  const format = 'amp';
  const routeProps = { site, selected, format };

  // Gets the actual title from selected.
  const { title } = selected.single.meta;

  // Gets the actual url from selected.
  const url = getUrl({ selected, format });

  return (
    <Fragment>
      {/* Anonymizes pageviews if needed */}
      <GoogleAnalytics
        title={anonymize ? getAnonymousTitle(routeProps) : getTitle(routeProps)}
        documentLocation={anonymize ? getAnonymousUrl(routeProps) : url}
        trackingId={dev ? 'UA-91312941-5' : 'UA-91312941-6'}
        extraUrlParams={extraUrlParams}
      />
      {trackingIds.map(trackingId => (
        <GoogleAnalytics
          key={trackingId}
          trackingId={trackingId}
          title={title}
          documentLocation={url}
        />
      ))}
    </Fragment>
  );
};

Analytics.propTypes = {
  trackingIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  dev: PropTypes.bool.isRequired,
  site: PropTypes.string.isRequired,
  selected: PropTypes.shape({}).isRequired,
  anonymize: PropTypes.bool.isRequired,
  extraUrlParams: PropTypes.shape({}).isRequired,
};

const mapStateToProps = state => {
  const getSetting = (namespace, setting) =>
    dep('settings', 'selectorCreators', 'getSetting')(namespace, setting);

  const site = getSetting('generalSite', 'url')(state);

  // Retrieves client analytics settings for AMP.
  const analytics = getSetting('theme', 'analytics')(state);
  const { dev } = state.build;
  const trackingIds = getGaTrackingIds({ dev, analytics, format: 'amp' });
  const anonymize = (analytics && analytics.anonymize) || false;

  // Gets the custom dimensions' values
  const siteId = getSetting('generalSite', '_id')(state);
  const userIds = getSetting('generalSite', 'userIds')(state);
  const theme = getSetting('theme', 'woronaInfo')(state).name;
  const extensions = dep('build', 'selectors', 'getPackages')(state).toString();
  const pageType = 'amp';
  const plan = 'enterprise';

  return {
    trackingIds,
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
  };
};

export default connect(mapStateToProps)(
  inject(({ connection }) => ({
    selected: connection.selected,
  }))(Analytics),
);
