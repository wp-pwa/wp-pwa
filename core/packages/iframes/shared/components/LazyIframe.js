import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { inject } from 'mobx-react';
import LazyLoad from '@frontity/lazyload';

class LazyIframe extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    className: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    isSsr: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    className: '',
  };

  constructor(props) {
    super(props);
    const { isSsr } = props;
    this.state = { isSsr, loaded: isSsr };
    this.onLoad = this.onLoad.bind(this);
  }

  onLoad() {
    this.setState({ loaded: true });
  }

  render() {
    const { name, src, className, width, height } = this.props;
    const { isSsr, loaded } = this.state;

    if (isSsr)
      return (
        <Iframe
          title={name}
          src={src}
          className={className}
          width={0}
          height={0}
          minWidth={width}
          minHeight={height}
        />
      );

    return (
      <Container className={className}>
        <StyledLazy
          width={width}
          height={height}
          offsetHorizontal={-50}
          throttle={50}
          loaded={loaded}
          debounce={false}
          className={className}
        >
          <Iframe
            title={name}
            src={src}
            className={className}
            width={0}
            height={0}
            minWidth={width}
            minHeight={height}
            onLoad={this.onLoad}
          />
        </StyledLazy>
        {/* {!loaded && <SpinnerContainer>{Spinner && <Spinner />}</SpinnerContainer>} */}
      </Container>
    );
  }
}

export default inject(({ build }) => ({
  isSsr: build.isSsr,
}))(LazyIframe);

const StyledLazy = styled(LazyLoad)`
  filter: ${({ loaded }) => (loaded ? 'opacity(100%)' : 'opacity(0)')};
  transition: filter 100ms ease-in;
`;

const Container = styled.div`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
`;

const Iframe = styled.iframe`
  min-width: ${({ minWidth }) => (typeof minWidth === 'number' ? `${minWidth}px` : minWidth)};
  min-height: ${({ minHeight }) => (typeof minHeight === 'number' ? `${minHeight}px` : minHeight)};
  margin: 0 auto;
  display: block;
  border: none;
`;
