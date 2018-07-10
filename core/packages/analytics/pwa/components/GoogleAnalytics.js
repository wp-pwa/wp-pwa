/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { getTrackerName } from '../../shared/utils';

const GoogleAnalytics = ({ id }) => (
  <script
    dangerouslySetInnerHTML={{
      __html: `
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', '${id}', 'auto', '${getTrackerName(id)}');
ga('${getTrackerName(id)}.send', 'pageview');`,
    }}
  />
);

GoogleAnalytics.propTypes = {
  id: PropTypes.string.isRequired,
};

export default GoogleAnalytics;
