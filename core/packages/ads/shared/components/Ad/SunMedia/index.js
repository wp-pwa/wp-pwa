import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import styled from 'styled-components';

class SunMedia extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    isSsr: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.isSsr = props.isSsr;
    this.node = React.createRef();
  }

  componentDidMount() {
    const script = window.document.createElement('script');
    script.async = true;
    script.type = 'application/javascript';
    script.src = this.props.src;
    this.node.current.appendChild(script);
  }

  render() {
    const { active, width, height, src } = this.props;
    const { isSsr } = this;

    if (!active) return null;

    return (
      <Container styles={{ width, height }} ref={this.node}>
        {isSsr ? (
          <script async type="application/javascript" src={src} />
        ) : null}
      </Container>
    );
  }
}

export default inject(({ stores }) => ({
  isSsr: stores.build.isSsr,
}))(SunMedia);

const Container = styled.div`
  width: ${({ styles }) => `${styles.width}px`};
  height: ${({ styles }) => `${styles.height}px`};
`;
