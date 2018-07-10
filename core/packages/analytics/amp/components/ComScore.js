/* eslint-disable react/jsx-no-target-blank, react/no-danger */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const ComScore = ({ id }) => (
  <Fragment>
    <Helmet>
      <script
        async=""
        custom-element="amp-analytics"
        src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"
      />
    </Helmet>
    <amp-analytics type="comscore">
      <script
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            vars: {
              c2: id,
            },
          }),
        }}
      />
    </amp-analytics>
  </Fragment>
);

ComScore.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default ComScore;
