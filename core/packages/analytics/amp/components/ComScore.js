/* eslint-disable react/jsx-no-target-blank, react/no-danger */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const ComScore = ({ id }) => (
  <Fragment>
    <Helmet>
      <amp-pixel src={`https://sb.scorecardresearch.com/p?c1=2&c2=${id}&cv=2.0&cj=1`} />
    </Helmet>
  </Fragment>
);

ComScore.propTypes = {
  id: PropTypes.number.isRequired,
};

export default ComScore;
