import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Fill } from 'react-slot-fill';
import Ad from './Ad';
import { getFills } from '../selectors';

const Ads = ({ ads }) =>
  ads.map(({ name, ...adProps }) => (
    <Fill key={name} name={name}>
      <Ad {...adProps} slotName={name} />
    </Fill>
  ));

Ads.propTypes = {
  ads: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ),
};

const mapStateToProps = state => ({
  ads: getFills(state),
});

export default connect(mapStateToProps)(Ads);
export { Ad };
