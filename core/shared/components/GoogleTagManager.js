import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

export const gtmScript = gtmId => (
  <script async src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`} />
);

export const gtmNoScript = gtmId => (
  <noscript>
    {`<iframe
      src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
      height="0"
      width="0"
      style={{ display: 'none', visibility: 'hidden' }}
    ></iframe>`}
  </noscript>
);

const GoogleTagManager = ({ gtmId, isAmp }) => {
  if (isAmp) return null;

  return (
    <Helmet>
      {gtmScript(gtmId)}
      {gtmNoScript(gtmId)}
    </Helmet>
  );
};

GoogleTagManager.propTypes = {
  gtmId: PropTypes.string.isRequired,
  isAmp: PropTypes.bool.isRequired
};

export default GoogleTagManager;
