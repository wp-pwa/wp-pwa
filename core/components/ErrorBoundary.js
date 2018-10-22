/* eslint-disable class-methods-use-this, no-console */
import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  componentDidCatch(error, info) {
    console.warn(error, info);

    const name = 'wppwaInjectorFailed';
    const value = 'true';
    const seconds = 3;

    const d = new Date();
    d.setTime(d.getTime() + seconds * 1000);

    window.document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
    window.location.reload(true);
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

export default ErrorBoundary;
