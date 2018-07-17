import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Lazy from '@frontity/lazyload';

class LazyUnload extends Component {
  static propTypes = {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.number,
    minTime: PropTypes.number.isRequired,
    maxTime: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    debounce: PropTypes.bool,
    active: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    isLazy: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    debounce: false,
    isLazy: true,
    width: null,
    height: null,
  };

  static randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  constructor(props) {
    super(props);
    this.state = { dying: false };
  }

  componentWillReceiveProps(nextProps) {
    const { active, minTime, maxTime } = this.props;
    const { dying } = this.state;
    if (active && !nextProps.active) {
      this.setState({ dying: true });
      this.countdown = setTimeout(() => {
        this.setState({ dying: false });
      }, LazyUnload.randomBetween(minTime, maxTime));
    }

    if (!active && nextProps.active && dying) {
      clearTimeout(this.countdown);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.countdown);
  }

  render() {
    const {
      width,
      height,
      active,
      offset,
      debounce,
      children,
      className,
      isLazy,
    } = this.props;
    const { dying } = this.state;

    const LazyComponent = isLazy ? Lazy : 'div';
    const lazyProps = {
      offsetVertical: offset,
      offsetHorizontal: 40,
      debounce,
    };

    return (
      (active || dying) && (
        <LazyComponent
          height={height}
          width={width}
          className={className}
          {...(isLazy ? lazyProps : {})}
        >
          {children}
        </LazyComponent>
      )
    );
  }
}

export default LazyUnload;
