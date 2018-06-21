import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

class SunMedia extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    isAmp: PropTypes.bool.isRequired,
    cid: PropTypes.string,
  };

  static defaultProps = {
    cid: null,
  };

  componentDidMount() {
    if (this.props.isAmp) return;

    const script = document.createElement('script');
    script.async = true;
    script.type = 'application/javascript';
    script.src = this.props.src;
    this.ref.appendChild(script);
  }

  render() {
    const { active, isAmp, cid } = this.props;

    // This won't work for now, as we are filtering out sunmedia ads on AMP,
    // but we can try again later if we have some way to get the `data-cid`.
    if (isAmp) {
      return (
        <Fragment>
          <Helmet>
            <script
              async=""
              custom-element="amp-ad"
              src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"
            />
          </Helmet>
          <amp-ad type="sunmedia" layout="fill" data-cid={cid} data-cskp={1} data-crst={1} />
        </Fragment>
      );
    }

    return active ? (
      <div
        ref={node => {
          this.ref = node;
        }}
      />
    ) : null;
  }
}

export default SunMedia;
