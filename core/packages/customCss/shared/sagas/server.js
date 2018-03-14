import { take, select } from 'redux-saga/effects';
import { injectGlobal } from 'react-emotion';
import { dep } from 'worona-deps';

export default function* customCssServerSaga() {
  yield take(dep('build', 'actionTypes', 'SERVER_SAGAS_INITIALIZED'));

  const getSetting = dep('settings', 'selectorCreators', 'getSetting');
  const customCssSettings = yield select(getSetting('theme', 'customCss'));
  const customCssTest = '.custom-css-test { background: red !important; }';

  console.log('CUSTOM CSS', customCssSettings || customCssTest);
  // eslint-disable-next-line
  injectGlobal`
    ${customCssSettings || customCssTest}
  `;
}
