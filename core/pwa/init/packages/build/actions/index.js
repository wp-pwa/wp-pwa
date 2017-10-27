import * as types from '../types';

export const buildUpdated = ({ packages, environment, ssr, amp, siteId }) => ({
  type: types.BUILD_UPDATED,
  packages,
  environment,
  ssr,
  amp,
  siteId,
});

export const serverStarted = () => ({
  type: types.SERVER_STARTED,
});

export const serverFinished = ({ timeToRunSagas }) => ({
  type: types.SERVER_FINISHED,
  timeToRunSagas,
});

export const serverSagasInitialized = () => ({
  type: types.SERVER_SAGAS_INITIALIZED,
});

export const clientStarted = () => ({
  type: types.CLIENT_STARTED,
});

export const clientSagasInitialized = () => ({
  type: types.CLIENT_SAGAS_INITIALIZED,
});

export const clientRendered = () => ({
  type: types.CLIENT_RENDERED,
});
