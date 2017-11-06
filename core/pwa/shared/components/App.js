import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import { Universal } from './Universal';

const App = ({ packages, store }) => (
  <Provider store={store}>
    <div>
      <Helmet>
        <title>WP PWA</title>
      </Helmet>
      <h1>WP-PWA</h1>
      {packages.map(name => <Universal key={name} name={name} />)}
    </div>
  </Provider>
);
App.propTypes = {
  packages: PropTypes.arrayOf(PropTypes.string).isRequired,
  store: PropTypes.shape().isRequired,
};

export default App;
