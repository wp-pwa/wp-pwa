import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dep } from 'worona-deps';
import GoogleTagManager from './GoogleTagManager';

const TagManagers = ({ isAmp, gtmContainers }) => {
  if (isAmp) return null;

  return (
    <Fragment>
      <GoogleTagManager gtmId="GTM-K3S2BMT" isAmp={isAmp} />
      {gtmContainers.map(id => (
        <GoogleTagManager key={id} gtmId={id} isAmp={isAmp} />
      ))}
    </Fragment>
  );
};

TagManagers.propTypes = {
  gtmContainers: PropTypes.arrayOf(PropTypes.string),
  isAmp: PropTypes.bool.isRequired,
};

TagManagers.defaultProps = {
  gtmContainers: [],
};

const mapStateToProps = state => {
  const analytics = dep('settings', 'selectorCreators', 'getSetting')('theme', 'analytics')(state);
  const gtmContainers = (analytics && analytics.pwa && analytics.pwa.gtmContainers) || [];
  return {
    gtmContainers,
    isAmp: state.build.amp,
  };
};

export default connect(mapStateToProps)(TagManagers);
