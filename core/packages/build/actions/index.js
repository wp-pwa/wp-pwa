import * as actionTypes from '../actionTypes';

export const buildUpdated = ({
  packages,
  env,
  ssr,
  amp,
  siteId,
  perPage,
  device,
  system,
  dev,
  initialUrl
}) => ({
  type: actionTypes.BUILD_UPDATED,
  packages,
  env,
  ssr,
  amp,
  siteId,
  device,
  system,
  dev,
  initialUrl,
  perPage: parseInt(perPage, 10)
});

export const serverStarted = () => ({
  type: actionTypes.SERVER_STARTED
});

export const serverFinished = ({ timeToRunSagas }) => ({
  type: actionTypes.SERVER_FINISHED,
  timeToRunSagas
});

export const serverSagasInitialized = () => ({
  type: actionTypes.SERVER_SAGAS_INITIALIZED
});

export const clientStarted = () => ({
  type: actionTypes.CLIENT_STARTED
});

export const clientSagasInitialized = () => ({
  type: actionTypes.CLIENT_SAGAS_INITIALIZED
});

export const clientRendered = () => ({
  type: actionTypes.CLIENT_RENDERED
});
