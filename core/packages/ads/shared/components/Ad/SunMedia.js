import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class SunMedia extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  };

  componentDidMount() {
    const script = window.document.createElement('script');
    script.async = true;
    script.type = 'application/javascript';
    script.src = this.props.src;
    this.node.appendChild(script);
  }

  render() {
    const { active, width, height } = this.props;

    return active ? (
      <Container
        styles={{ width, height }}
        ref={node => {
          this.node = node;
        }}
      />
    ) : null;
  }
}

export default SunMedia;

const Container = styled.div`
  width: ${({ styles }) => `${styles.width}px`};
  height: ${({ styles }) => `${styles.height}px`};
`;
