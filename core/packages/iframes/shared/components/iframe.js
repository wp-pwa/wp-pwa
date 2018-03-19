import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

class Iframe extends Component {
  static propTypes = {
    ssr: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { loaded: props.ssr };
    this.onLoad = this.onLoad.bind(this);
  }

  onLoad() {
    this.setState({ loaded: true });
  }

  render() {
    const { props, onLoad } = this;
    const { loaded } = this.state;
    return <StyledIframe {...props} onLoad={onLoad} loaded={loaded || props.ssr}/>
  }
}

export default Iframe;

const StyledIframe = styled.iframe`
  filter: ${({ loaded }) => (loaded ? 'opacity(100%)' : 'opacity(0)')};
  transition: filter 300ms ease-in;
`;
