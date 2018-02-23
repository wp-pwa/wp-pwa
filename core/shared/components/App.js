import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as MobxProvider } from 'mobx-react';
import Analytics from './Analytics';
import Universal from './Universal';

const App = ({ packages, store, stores }) => (
  <ReduxProvider store={store}>
    <MobxProvider {...stores}>
      <Fragment>
        <Helmet>
          <title>WP PWA</title>
        </Helmet>
        <Analytics />
        {packages.map(name => <Universal key={name} name={name} />)}
      </Fragment>
    </MobxProvider>
  </ReduxProvider>
);

App.propTypes = {
  packages: PropTypes.arrayOf(PropTypes.string).isRequired,
  store: PropTypes.shape().isRequired,
  stores: PropTypes.shape().isRequired,
};

export default App;
