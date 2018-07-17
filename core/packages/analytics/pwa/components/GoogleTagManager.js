/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

export const gtmScript = id => (
  <script async src={`https://www.googletagmanager.com/gtm.js?id=${id}`} />
);

export const gtmNoScript = id => (
  <noscript>
    {`
<iframe
  src="https://www.googletagmanager.com/ns.html?id=${id}"
  height="0"
  width="0"
  style={{ display: 'none', visibility: 'hidden' }}
></iframe>`}
  </noscript>
);

const GoogleTagManager = ({ id }) => (
  <Helmet>
    {gtmScript(id)}
    {gtmNoScript(id)}
  </Helmet>
);

GoogleTagManager.propTypes = {
  id: PropTypes.string.isRequired,
};

export default GoogleTagManager;
