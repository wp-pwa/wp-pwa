import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { Helmet } from 'react-helmet';

const linkCount = {};

class AdSense extends PureComponent {
  static propTypes = {
    client: PropTypes.string.isRequired,
    slot: PropTypes.string.isRequired,
    format: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isAmp: PropTypes.bool.isRequired,
    fallback: PropTypes.shape(AdSense.propTypes),
    isMedia: PropTypes.bool,
  };

  static defaultProps = {
    format: null,
    width: 300,
    height: 250,
    fallback: null,
    isMedia: false,
  };

  static push({ client, slot, format }) {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});

      if (format === 'link') {
        const id = `${client}/${slot}`;
        linkCount[id] = (linkCount[id] || 0) + 1;
      }
    } catch (e) {
      // console.warn(e);
    }
  }

  componentDidMount() {
    if (window) AdSense.push(this.props);
  }

  componentWillUnmount() {
    // Removes Google's handler for this ad
    const iframe = this.node.querySelector('iframe');
    if (iframe) {
      const { google_iframe_oncopy: { handlers } } = window;
      delete handlers[iframe.id];
    }
  }

  render() {
    const { isAmp, fallback, isMedia } = this.props;
    let { client, slot, width, height, format } = this.props;

    // Uses fallback if limit was reached
    const id = `${client}/${slot}`;
    if (format === 'link' && linkCount[id] >= 3 && fallback) {
      ({ client, slot, width, height, format } = fallback);
    }

    if (isAmp) {
      return [
        <Helmet>
          <script
            async=""
            custom-element="amp-ad"
            src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"
          />
        </Helmet>,
        <amp-ad type="adsense" data-ad-client={client} data-ad-slot={slot} layout="fill" />,
      ];
    }

    return (
      <Fragment>
        <Helmet>
          <script src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" async />
        </Helmet>
        <StyledIns
          innerRef={ins => {
            this.node = ins;
          }}
          className="adsbygoogle"
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          width={width}
          height={height}
          isMedia={isMedia}
        />
      </Fragment>
    );
  }
}

export default AdSense;

const StyledIns = styled.ins`
  display: block;
  background-color: ${({ theme, isMedia }) => (isMedia ? 'transparent' : theme.colors.white)};
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width)};
  height: ${({ height }) => (typeof height === 'number' ? `${height}px` : height)};
  margin: 0 auto;
`;
