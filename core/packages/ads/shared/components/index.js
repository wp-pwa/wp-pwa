import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Fill } from 'react-slot-fill';
import Ad from './Ad';
import Sticky from './Sticky';
import * as selectors from '../selectors';

const Ads = ({ ads, adsAreLazy }) =>
  ads.map(({ name, ...adProps }) => (
    <Fill key={name} name={name}>
      <Ad {...adProps} isLazy={adsAreLazy} slotName={name} />
    </Fill>
  ));

Ads.propTypes = {
  ads: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ),
  adsAreLazy: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  ads: selectors.getFills(state),
  adsAreLazy: selectors.areLazy(state),
});

export default connect(mapStateToProps)(Ads);
export { Ad, Sticky };
