import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dep } from 'worona-deps';
import GoogleTagManager from './GoogleTagManager';

const TagManagers = ({ isAmp, clientIds }) => {
  if (isAmp) return (
    <GoogleTagManager gtmId="GTM-WHX5KF5" isAmp />
  );

  return (
    <Fragment>
      <GoogleTagManager gtmId="GTM-K3S2BMT" isAmp={isAmp} />
      {clientIds.map(id => (
        <GoogleTagManager key={id} gtmId={id} isAmp={isAmp} />
      ))}
    </Fragment>
  );
};

TagManagers.propTypes = {
  clientIds: PropTypes.arrayOf(PropTypes.string),
  isAmp: PropTypes.bool.isRequired,
};

TagManagers.defaultProps = {
  clientIds: [],
};

const mapStateToProps = state => {
  const gtm = dep('settings', 'selectorCreators', 'getSetting')('theme', 'gtm')(state);
  const clientIds = (gtm && gtm.clientIds) || [];
  return {
    clientIds,
    isAmp: state.build.amp,
  };
};

export default connect(mapStateToProps)(TagManagers);
