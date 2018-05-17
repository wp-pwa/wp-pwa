import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Provider as MobxProvider } from 'mobx-react';
import { Provider as SlotFillProvider } from 'react-slot-fill';
import Universal from './Universal';

const App = ({ core, packages, stores }) => (
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
);

App.propTypes = {
  core: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  packages: PropTypes.arrayOf(PropTypes.string).isRequired,
  stores: PropTypes.shape().isRequired,
};

export default App;
