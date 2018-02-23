/* eslint-disable react/no-danger */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

export const comScoreScript = id => (
  <script
    async
    type="application/javascript"
    dangerouslySetInnerHTML={{
      __html: `
var _comscore = _comscore || [];

var pixelComscore = function() {
    _comscore.push({ c1: "2", c2: "${id}" });
    (function() {
        var s = document.createElement("script"), el = document.getElementsByTagName("script")[0]; s.async = true;
        s.src = (document.location.protocol == "https:" ? "https://sb" : "http://b") + ".scorecardresearch.com/beacon.js";
        el.parentNode.insertBefore(s, el);
    })();
};

pixelComscore();
`,
    }}
  />
);

export const comScoreNoScript = id => (
  <noscript>
    {`<img alt="comScore" src="https://sb.scorecardresearch.com/p?c1=2&c2=${id}&cv=2.0&cj=1" />`}
  </noscript>
);

const ComScore = ({ id }) => (
  <Fragment>
    <Helmet>{comScoreNoScript(id)}</Helmet>
    {comScoreScript(id)}
  </Fragment>
);

ComScore.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ComScore;
