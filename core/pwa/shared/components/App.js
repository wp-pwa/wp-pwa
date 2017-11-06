import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import { UniversalComponent } from '../../client/universal';
import styles from '../css/App.css';

const App = ({ packages, store }) => (
  <Provider store={store}>
    <div className={styles.container}>
      <Helmet>
        <title>WP PWA</title>
      </Helmet>
      <h1>Hello Reactlandia</h1>
      {packages.map(name => <UniversalComponent key={name} name={name} />)}
    </div>
  </Provider>
);
App.propTypes = {
  packages: PropTypes.arrayOf(PropTypes.string).isRequired,
  store: PropTypes.shape().isRequired,
};

export default App;
