import React from 'react';
import PropTypes from 'prop-types';
import universal from 'react-universal-component';
import { connect, Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import styles from '../css/App.css';
import Loading from './Loading';
import NotFound from './NotFound';
import { pages, nextIndex, indexFromPath } from '../utils';

const UniversalComponent = universal(
  props => import(`../../../../packages/${props.page}/src/pwa`),
  {
    minDelay: 1200,
    loading: Loading,
    error: NotFound,
  },
);

class App extends React.Component {
  static propTypes = {
    siteId: PropTypes.string,
    settings: PropTypes.bool,
    store: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    siteId: null,
    settings: false,
  };

  constructor(props) {
    super(props);

    const { history } = props;
    const index = indexFromPath(history.location.pathname);

    this.state = {
      index,
      loading: false,
      done: false,
      error: false,
    };

    history.listen(({ pathname }) => {
      const index = indexFromPath(pathname);
      this.setState({ index });
    });
  }

  changePage = () => {
    if (this.state.loading) return;

    const index = nextIndex(this.state.index);
    const page = pages[index];

    this.props.history.push(`/${page}`);
  };

  beforeChange = ({ isSync }) => {
    if (!isSync) {
      this.setState({ loading: true, error: false });
    }
  };

  afterChange = ({ isSync, isServer, isMount }) => {
    if (!isSync) {
      this.setState({ loading: false, error: false });
    } else if (!isServer && !isMount) {
      this.setState({ done: true, error: false });
    }
  };

  handleError = () => {
    this.setState({ error: true, loading: false });
  };

  buttonText() {
    const { loading, error } = this.state;
    if (error) return 'ERROR';
    return loading ? 'LOADING...' : 'CHANGE PAGE';
  }

  render() {
    const { index, done, loading } = this.state;
    const page = pages[index];
    const loadingClass = loading ? styles.loading : '';
    const buttonClass = `${styles[page]} ${loadingClass}`;

    return (
      <Provider store={this.props.store}>
        <div className={styles.container}>
          <Helmet>
            <title>WP PWA</title>
          </Helmet>
          <h1>Hello Reactlandia</h1>
          {done && <div className={styles.checkmark}>all loaded ✔</div>}

          <UniversalComponent
            page={page}
            onBefore={this.beforeChange}
            onAfter={this.afterChange}
            onError={this.handleError}
          />

          <button className={buttonClass} onClick={this.changePage}>
            {this.buttonText()}
          </button>

          <p>
            <span>*why are you looking at this? refresh the page</span>
            <span>and view the source in Chrome for the real goods</span>
          </p>
        </div>
      </Provider>
    );
  }
}

const mapState = state => ({
  siteId: state.build.siteId,
  settings: !!state.settings.collection.generalSite,
});

export default connect(mapState)(App);
