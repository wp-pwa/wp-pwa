/* eslint-disable import/prefer-default-export */
export const getGaTrackingIds = ({ dev, analytics = {} }) =>
  dev ? ['UA-91312941-7'] : (analytics.amp && analytics.amp.gaTrackingIds) || [];
