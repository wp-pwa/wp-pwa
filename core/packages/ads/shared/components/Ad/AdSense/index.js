/* eslint-disable react/no-danger */
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import Script from '../../Script';

// eslint-disable-next-line
import call from 'raw-loader!babel-loader?forceEnv=devClient!./functions/call';

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

  constructor() {
    super();
    this.node = React.createRef();
  }
  componentDidMount() {
    const { client, slot, format } = this.props;

    // Count link instances
    if (format === 'link') {
      const id = `${client}/${slot}`;
      linkCount[id] = (linkCount[id] || 0) + 1;
    }
  }

  componentWillUnmount() {
    // Removes Google's handler for this ad
    const iframe = this.node.current.querySelector('iframe');
    if (iframe) {
      const {
        google_iframe_oncopy: { handlers },
      } = window;
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
        <amp-ad
          type="adsense"
          data-ad-client={client}
          data-ad-slot={slot}
          layout="fill"
        />,
      ];
    }

    return (
      <Fragment>
        <Helmet>
          <script
            src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            async
          />
        </Helmet>
        <Container isMedia={isMedia} width={width} height={height}>
          <ins
            ref={this.node}
            className="adsbygoogle"
            data-ad-client={client}
            data-ad-slot={slot}
            data-ad-format={format}
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: '' }}
          />
        </Container>
        <Script func={call} />
      </Fragment>
    );
  }
}

export default AdSense;

const Container = styled.div`
  & > ins {
    display: block;
    background-color: ${({ theme, isMedia }) =>
      isMedia ? 'transparent' : theme.colors.white};
    width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width)};
    height: ${({ height }) =>
      typeof height === 'number' ? `${height}px` : height};
    margin: 0 auto;
  }
`;
