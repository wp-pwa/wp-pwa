import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { createGlobalStyle } from 'styled-components';

const CustomCss = ({ customCss }) => {
  if (!customCss) return null;

  const CustomCssStyles = createGlobalStyle`
    ${customCss}
  `;

  return <CustomCssStyles />;
};

CustomCss.propTypes = {
  customCss: PropTypes.string.isRequired,
};

export default inject(({ stores: { settings } }) => ({
  customCss: settings.theme.customCss || '',
}))(CustomCss);
