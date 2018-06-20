import React from 'react';
import PropTypes from 'prop-types';

const SunMedia = ({ src }) => <script async type="application/javascript" src={src} />;

SunMedia.propTypes = {
  src: PropTypes.string.isRequired,
};

export default SunMedia;
