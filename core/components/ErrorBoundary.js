/* eslint-disable class-methods-use-this, no-console */
import React from 'react';
import PropTypes from 'prop-types';
import ErrorMessage from './ErrorMessage';

class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  state = { hasError: false };

  componentDidCatch(error, info) {
    console.warn(error, info);

    // Show an error message only for non-producction URLs
    if (window.location.hostname.endsWith('wp-pwa.com')) {
      this.setState({ hasError: true });
      return;
    }

    // Reload the URL with the classic version
    const name = 'wppwaInjectorFailed';
    const value = 'true';
    const seconds = 3;

    const d = new Date();
    d.setTime(d.getTime() + seconds * 1000);

    window.document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
    window.location.reload(true);
  }

  render() {
    return this.state.hasError ? <ErrorMessage /> : this.props.children;
  }
}

export default ErrorBoundary;
