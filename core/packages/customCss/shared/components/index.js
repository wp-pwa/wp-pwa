import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { css } from 'react-emotion';
import { dep } from 'worona-deps';

const CustomCss = ({ customCss }) => {
  const className = css`
    ${customCss};
  `;
  return (
    // this do the trick
    <Helmet className={className}>
      <body className={className} />;
    </Helmet>
  );
};

CustomCss.propTypes = {
  customCss: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  customCss: dep('settings', 'selectorCreators', 'getSetting')('theme', 'customCss')(state) || '',
});

export default connect(mapStateToProps)(CustomCss);
