import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { Fill } from 'react-slot-fill';
import Ad from './Ad';
import Sticky from './Sticky';

const Ads = ({ fills }) =>
  fills.map(({ name, ...adProps }) => (
    <Fill key={name} name={name}>
      <Ad {...adProps} slotName={name} />
    </Fill>
  ));

Ads.propTypes = {
  fills: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ),
};

const emptyArray = [];

export default inject(({ settings }) => ({
  fills: settings.getSetting('theme', 'ads').fills || emptyArray,
}))(Ads);

export { Ad, Sticky };
