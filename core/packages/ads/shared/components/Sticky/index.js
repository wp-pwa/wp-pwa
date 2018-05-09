import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import styled from 'react-emotion';
import Transition from 'react-transition-group/Transition';
import IconClose from 'react-icons/lib/md/close';
import { dep } from 'worona-deps';
import * as actions from '../../actions';
import * as selectorCreators from '../../selectorCreators';

class Sticky extends Component {
  static propTypes = {
    Ad: PropTypes.func.isRequired,
    position: PropTypes.string,
    delay: PropTypes.number,
    duration: PropTypes.number,
    rememberClosedByUser: PropTypes.bool,
    format: PropTypes.shape({}),
    type: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isOpen: PropTypes.bool.isRequired,
    timeout: PropTypes.number,
    closedByUser: PropTypes.bool.isRequired,
    stickyHasShown: PropTypes.func.isRequired,
    stickyHasHidden: PropTypes.func.isRequired,
    stickyUpdateTimeout: PropTypes.func.isRequired,
  };

  static defaultProps = {
    timeout: null,
    format: null,
    position: 'bottom',
    delay: 0,
    duration: 0,
    rememberClosedByUser: false,
  };

  constructor() {
    super();

    this.handleShow = this.handleShow.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      shouldMount: true,
    };
  }

  componentDidMount() {
    this.handleShow();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.type !== nextProps.type || this.props.id !== nextProps.id) {
      this.handleShow();

      this.setState({ shouldMount: false }, () => {
        this.setState({ shouldMount: true });
      });
    }
  }

  handleShow() {
    const {
      isOpen,
      timeout,
      closedByUser,
      format,
      delay,
      duration,
      rememberClosedByUser,
      stickyHasShown,
      stickyHasHidden,
      stickyUpdateTimeout,
    } = this.props;

    if (closedByUser && rememberClosedByUser) return;

    if (timeout) clearTimeout(timeout);

    if (isOpen) {
      if (!format) {
        stickyHasHidden({ closedByUser: false });
      } else if (duration) {
        const newTimeout = setTimeout(() => {
          stickyHasHidden({ closedByUser: false });
        }, duration);
        stickyUpdateTimeout({ timeout: newTimeout });
      }
    } else if (format) {
      setTimeout(() => {
        if (duration) {
          const newTimeout = setTimeout(() => {
            stickyHasHidden({ closedByUser: false });
          }, duration);
          stickyHasShown({ timeout: newTimeout });
        } else {
          stickyHasShown({ timeout: null });
        }
      }, delay);
    }
  }

  handleClick() {
    const { timeout, stickyHasHidden } = this.props;

    if (timeout) clearTimeout(timeout);

    stickyHasHidden({ closedByUser: true });
  }

  render() {
    const { isOpen, position, format, Ad } = this.props;
    const { shouldMount } = this.state;

    return (
      <Transition
        in={isOpen}
        timeout={150}
        mountOnEnter
        unmountOnExit
        onEnter={node => node.scrollTop}
      >
        {status => (
          <Container status={status} stickyHeight={format && format.height} position={position}>
            <CloseButton onClick={this.handleClick} position={position}>
              <IconClose size={20} verticalAlign="none" />
            </CloseButton>
            {format && shouldMount && <Ad active isSticky {...format} />}
          </Container>
        )}
      </Transition>
    );
  }
}

const mapStateToProps = (state, { type }) => ({
  format: selectorCreators.ads.getStickyFormat(type)(state),
});

const mapDispatchToProps = dispatch => ({
  stickyHasShown: payload => dispatch(actions.sticky.hasShown(payload)),
  stickyHasHidden: payload => dispatch(actions.sticky.hasHidden(payload)),
  stickyUpdateTimeout: payload => dispatch(actions.sticky.updateTimeout(payload)),
});

export default compose(
  inject(({ connection, ads, settings }) => {
    const { sticky } = settings.theme.ads;
    return {
      Ad: dep('ads', 'components', 'Ad'),
      type: connection.selectedItem.type,
      id: connection.selectedItem.id,
      isOpen: ads.sticky.isOpen,
      timeout: ads.sticky.timeout,
      closedByUser: ads.sticky.closedByUser,
      position: sticky && sticky.position,
      delay: sticky && sticky.delay,
      duration: sticky && sticky.duration,
      rememberClosedByUser: sticky && sticky.rememberClosedByUser,
    };
  }),
  connect(mapStateToProps, mapDispatchToProps),
)(Sticky);

const Container = styled.div`
  box-sizing: border-box;
  position: fixed;
  ${({ position }) => (position === 'bottom' ? 'bottom: 0' : 'top: 0')};
  width: 100vw;
  height: auto;
  padding: 2px 0;
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 2147483646;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transform: ${({ status, position }) =>
    status.startsWith('enter')
      ? 'translateY(0%)'
      : `translateY(${position === 'bottom' ? '100%' : '-100%'})`};
  transition: transform 150ms ease-out;
  min-height: 50px;
`;

const CloseButton = styled.div`
  box-sizing: border-box;
  position: absolute;
  ${({ position }) => (position === 'bottom' ? 'top: -20px' : 'bottom: -20px')};
  padding-top: 3px;
  right: 5px;
  height: 20px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ position }) =>
    position === 'bottom' ? 'border-top-left-radius: 20px' : 'border-bottom-left-radius: 20px'};
  ${({ position }) =>
    position === 'bottom' ? 'border-top-right-radius: 20px' : 'border-bottom-right-radius: 20px'};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;
