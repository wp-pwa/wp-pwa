import React, { Fragment } from 'react';
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
    <Fragment>
      <span className={className} style={{ display: 'none' }} />
      <Helmet>
        <body className={className} />;
      </Helmet>
    </Fragment>
  );
};

CustomCss.propTypes = {
  customCss: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  customCss: dep('settings', 'selectorCreators', 'getSetting')('theme', 'customCss')(state) || '',
});

export default connect(mapStateToProps)(CustomCss);
