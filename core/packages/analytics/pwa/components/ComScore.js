/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

export const comScoreNoScript = id => (
  <noscript>
    {`<img alt="comScore" src="https://sb.scorecardresearch.com/p?c1=2&c2=${id}&cv=2.0&cj=1" />`}
  </noscript>
);

const ComScore = ({ id }) => <Helmet>{comScoreNoScript(id)}</Helmet>;

ComScore.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ComScore;
