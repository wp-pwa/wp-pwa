/* eslint-disable react/jsx-no-target-blank, react/no-danger, no-underscore-dangle */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { inject } from 'mobx-react';
import { dep } from 'worona-deps';
import sha256 from 'crypto-js/sha256';
import hex from 'crypto-js/enc-hex';
import GoogleAnalytics from './GoogleAnalytics';

const getHash = obj => hex.stringify(sha256(JSON.stringify(obj))).slice(0, 13);

const getRouteTitleAndLocation = ({ site, title, documentLocation, selected, anonymize }) => {
  // Gets selected info.
  const { route, type, id, page } = selected;

  // Creates a hash string from the current selected info.
  const hash = getHash({ site, title, url: documentLocation, route, type, id, page });
  return {
    routeTitle: anonymize
      ? `anonymous - ${route} - ${type} - ${hash}`
      : `${site} - ${route} - ${type} - ${id}${page ? ` - page ${page}` : ''}`,
    routeLocation: anonymize ? `anonymous/${hash}` : `/${documentLocation}`,
  };
};

const Analytics = ({
  trackingIds,
  title,
  documentLocation,
  debug,
  extraUrlParams,
  site,
  selected,
  anonymize,
}) => {
  const { routeTitle, routeLocation } = getRouteTitleAndLocation({
    site,
    title,
    documentLocation,
    selected,
    anonymize,
  });

  return (
    <Fragment>
      <GoogleAnalytics
        title={routeTitle}
        documentLocation={routeLocation}
        trackingId={debug ? 'UA-91312941-5' : 'UA-91312941-6'}
        extraUrlParams={extraUrlParams}
      />
      {trackingIds.map(trackingId => (
        <GoogleAnalytics
          trackingId={trackingId}
          title={title}
          documentLocation={documentLocation}
        />
      ))}
    </Fragment>
  );
};

Analytics.propTypes = {
  trackingIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  documentLocation: PropTypes.string.isRequired,
  site: PropTypes.string.isRequired,
  anonymize: PropTypes.bool.isRequired,
  selected: PropTypes.shape({}).isRequired,
  debug: PropTypes.bool.isRequired,
  extraUrlParams: PropTypes.shape({}).isRequired,
};

const mapStateToProps = state => {
  const getSetting = (namespace, setting) =>
    dep('settings', 'selectorCreators', 'getSetting')(namespace, setting);

  const site = getSetting('generalSite', 'url')(state);
  const debug = !(state.build.dev === false && state.build.env === 'prod');

  // Retrieves client analytics settings for AMP.
  const analytics = getSetting('theme', 'analytics')(state);
  const trackingIds = (analytics && analytics.amp && analytics.amp.gaTrackingIds) || [];
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
    debug,
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
  inject(({ connection }) => {
    const { selected } = connection;
    const { single } = selected;

    // Gets title from selected or siteInfo.
    const { title } = single.meta;

    // Creates documentLocation from post link and appends 'amp/' to it.s
    const link = single._link;
    const documentLocation = `${link}${link.endsWith('/') ? '' : '/'}amp/`;

    // Return properties.
    return { selected, title, documentLocation };
  })(Analytics),
);
