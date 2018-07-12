/* eslint-disable react/jsx-no-target-blank, react/no-danger */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const GoogleTagManager = ({ id, vars }) => (
  <Fragment>
    <Helmet>
      <script
        async=""
        custom-element="amp-analytics"
        src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"
      />
    </Helmet>
    <amp-analytics
      config={`https://www.googletagmanager.com/amp.json?id=${id}&gtm.url=SOURCE_URL`}
      data-credentials="include"
    >
      <script
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ vars }, null, 2),
        }}
      />
    </amp-analytics>
  </Fragment>
);

GoogleTagManager.propTypes = {
  id: PropTypes.string.isRequired,
  vars: PropTypes.shape({}),
};

GoogleTagManager.defaultProps = {
  vars: {},
};

export default GoogleTagManager;
