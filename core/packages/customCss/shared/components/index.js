import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { injectGlobal } from 'react-emotion';

const CustomCss = ({ css }) => {
  // eslint-disable-next-line
  injectGlobal`${css}`;
  return null && <div />;
};

CustomCss.propTypes = {
  css: PropTypes.string,
};

CustomCss.defaultProps = {
  css: '.custom-css-test { background: red !important; }',
};

export default CustomCss;
