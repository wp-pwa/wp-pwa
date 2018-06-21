import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SunMedia extends Component {
  componentDidMount() {
    const script = document.createElement('script');
    script.async = true;
    script.type = 'application/javascript';
    script.src = this.props.src;
    this.ref.appendChild(script);
  }

  render() {
    return this.props.active ? (
      <div
        id="sunmedia-contaier"
        ref={node => {
          this.ref = node;
        }}
      />
    ) : null;
  }
}

SunMedia.propTypes = {
  src: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
};

export default SunMedia;
