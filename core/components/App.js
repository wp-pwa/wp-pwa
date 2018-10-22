import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Provider as MobxProvider } from 'mobx-react';
import { Provider as SlotFillProvider } from 'react-slot-fill';
import Universal from './Universal';
import ErrorBoundary from './ErrorBoundary';

const App = ({ core, packages, stores, components }) => (
  <ErrorBoundary>
    <MobxProvider stores={stores} components={components}>
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
  </ErrorBoundary>
);

App.propTypes = {
  core: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  packages: PropTypes.arrayOf(PropTypes.string).isRequired,
  stores: PropTypes.shape().isRequired,
  components: PropTypes.shape({}).isRequired,
};

export default App;
