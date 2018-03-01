import * as actions from './actions';
import * as actionTypes from './actionTypes';
import reducers from './reducers';
import * as selectors from './selectors';
import * as selectorCreators from './selectorCreators';
import clientSagas from './sagas/client';
import serverSagas from './sagas/server';

const Settings = () => null;

export default Settings;
export { actions, actionTypes, reducers, clientSagas, serverSagas, selectors, selectorCreators };
