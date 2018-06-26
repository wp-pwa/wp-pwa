import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import GoogleTagManager from './GoogleTagManager';
import ComScore from './ComScore';

const Analytics = ({ isAmp, gtmContainers, comScoreIds }) => {
  if (isAmp) return null;

  return (
    <Fragment>
      <GoogleTagManager key="GTM-K3S2BMT" gtmId="GTM-K3S2BMT" />
      {gtmContainers.map(id => <GoogleTagManager key={id} gtmId={id} />)}
      {comScoreIds.map(id => <ComScore key={id} id={id} />)}
    </Fragment>
  );
};

Analytics.propTypes = {
  gtmContainers: PropTypes.arrayOf(PropTypes.string),
  comScoreIds: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ),
  isAmp: PropTypes.bool.isRequired,
};

Analytics.defaultProps = {
  gtmContainers: [],
  comScoreIds: [],
};

export default inject(({ stores: { settings, build } }) => {
  const { analytics } = settings.theme;
  const { gtmContainers, comScoreIds } = analytics ? analytics.pwa : {};
  return {
    gtmContainers,
    comScoreIds,
    isAmp: build.isAmp,
  };
})(Analytics);
