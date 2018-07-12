/* eslint-disable react/jsx-no-target-blank, react/no-danger */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const GoogleAnalytics = ({ id, pageView, vars, triggers }) => {
  const json = {
    vars: { account: id, ...vars },
    triggers,
  };

  if (pageView) {
    const { title, documentLocation, extraUrlParams } = pageView;
    json.extraUrlParams = extraUrlParams;
    json.triggers = {
      ...triggers,
      trackPageview: {
        on: 'visible',
        request: 'pageview',
        vars: {
          title,
          documentLocation,
        },
      },
    };
  }

  return (
    <Fragment>
      <Helmet>
        <script
          async=""
          custom-element="amp-analytics"
          src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"
        />
      </Helmet>
      <amp-analytics type="googleanalytics">
        <script
          type="application/json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(json),
          }}
        />
      </amp-analytics>
    </Fragment>
  );
};

GoogleAnalytics.propTypes = {
  id: PropTypes.string.isRequired,
  vars: PropTypes.shape({}),
  triggers: PropTypes.shape({}),
  pageView: PropTypes.oneOfType([
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      documentLocation: PropTypes.string.isRequired,
      extraUrlParams: PropTypes.shape({}),
    }),
    PropTypes.bool,
  ]),
};

GoogleAnalytics.defaultProps = {
  pageView: false,
  vars: {},
  triggers: {},
};

export default GoogleAnalytics;
