import * as actionTypes from '../actionTypes';

export const buildUpdated = ({ packages, environment, ssr, amp, siteId }) => ({
  type: actionTypes.BUILD_UPDATED,
  packages,
  environment,
  ssr,
  amp,
  siteId,
});

export const serverStarted = () => ({
  type: actionTypes.SERVER_STARTED,
});

export const serverFinished = ({ timeToRunSagas }) => ({
  type: actionTypes.SERVER_FINISHED,
  timeToRunSagas,
});

export const serverSagasInitialized = () => ({
  type: actionTypes.SERVER_SAGAS_INITIALIZED,
});

export const clientStarted = () => ({
  type: actionTypes.CLIENT_STARTED,
});

export const clientSagasInitialized = () => ({
  type: actionTypes.CLIENT_SAGAS_INITIALIZED,
});

export const clientRendered = () => ({
  type: actionTypes.CLIENT_RENDERED,
});
