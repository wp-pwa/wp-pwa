import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as MobxProvider } from 'mobx-react';
import { Provider as SlotFillProvider } from 'react-slot-fill';
import Universal from './Universal';

const App = ({ core, packages, store, stores }) => (
  <ReduxProvider store={store}>
    <MobxProvider {...stores}>
      <SlotFillProvider>
        <Fragment>
          <Helmet>
            <title>WP PWA</title>
          </Helmet>
          {core.map(({ name, Component }) => <Component key={name} />)}
          {packages.map(name => <Universal key={name} name={name} />)}
        </Fragment>
      </SlotFillProvider>
    </MobxProvider>
  </ReduxProvider>
);

App.propTypes = {
  core: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  packages: PropTypes.arrayOf(PropTypes.string).isRequired,
  store: PropTypes.shape().isRequired,
  stores: PropTypes.shape().isRequired,
};

export default App;
