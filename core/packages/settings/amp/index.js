import * as actions from '../shared/actions';
import * as actionTypes from '../shared/actionTypes';
import reducers from '../shared/reducers';
import * as selectors from '../shared/selectors';
import * as selectorCreators from '../shared/selectorCreators';
import clientSagas from '../shared/sagas/client';
import serverSagas from '../shared/sagas/server';

const Settings = () => null;

export default Settings;
export { actions, actionTypes, reducers, clientSagas, serverSagas, selectors, selectorCreators };
