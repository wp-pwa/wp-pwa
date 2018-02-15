import React, { Fragment } from 'react';
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
  if (isAmp)
    return (
      <Fragment>
        <Helmet>
          <script
            async=""
            custom-element="amp-analytics"
            src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"
          />
        </Helmet>
        <amp-analytics
          config={`https://www.googletagmanager.com/amp.json?id=${gtmId}&gtm.url=SOURCE_URL`}
          data-credentials="include">
          <script
            type="application/json"
            dangerouslySetInnerHTML={{ // eslint-disable-line
              __html: JSON.stringify({ vars: { trackingId: 'UA-101852748-1' } }),
            }}
          />
        </amp-analytics>
      </Fragment>
    );

  return (
    <Helmet>
      {gtmScript(gtmId)}
      {gtmNoScript(gtmId)}
    </Helmet>
  );
};

GoogleTagManager.propTypes = {
  gtmId: PropTypes.string.isRequired,
  isAmp: PropTypes.bool.isRequired,
};

export default GoogleTagManager;
