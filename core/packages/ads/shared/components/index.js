import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { Fill } from 'react-slot-fill';
import Ad from './Ad';
import Sticky from './Sticky';

const Ads = ({ fills, adsAreLazy }) =>
  fills.map(({ name, isSticky, ...adProps }) => (
    <Fill key={name} name={name}>
      {isSticky ? (
        <Sticky format={adProps} slotName={name} />
      ) : (
        <Ad {...adProps} isLazy={adsAreLazy} slotName={name} />
      )}
    </Fill>
  ));

Ads.propTypes = {
  fills: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ),
  adsAreLazy: PropTypes.bool,
};

Ads.defaultProps = {
  adsAreLazy: true,
};

export default inject(({ settings }) => {
  const ads = settings.theme.ads || {};

  return {
    fills: ads.fills || [],
    adsAreLazy: ads.areLazy,
  };
})(Ads);

export { Ad, Sticky };
