import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { Helmet } from 'react-helmet';
import { css } from 'styled-components';

const CustomCss = ({ customCss }) => {
  if (!customCss) return null;

  const className = css`
    ${customCss};
  `;
  return (
    // this do the trick
    <Fragment>
      <span className={className} />
      <Helmet>
        <body className={className} />;
      </Helmet>
    </Fragment>
  );
};

CustomCss.propTypes = {
  customCss: PropTypes.string.isRequired,
};

export default inject(({ stores: { settings } }) => ({
  customCss: settings.theme.customCss || '',
}))(CustomCss);
