import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import Script from '../../Script';

// eslint-disable-next-line
import call from 'raw-loader!babel-loader?forceEnv=devClient!./functions/call';

class DoubleClick extends PureComponent {
  static propTypes = {
    slot: PropTypes.string.isRequired,
    slotName: PropTypes.string.isRequired,
    slotPosition: PropTypes.string.isRequired,
    item: PropTypes.shape({
      mstId: PropTypes.string.isRequired,
    }).isRequired,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isAmp: PropTypes.bool.isRequired,
    json: PropTypes.shape({
      targeting: PropTypes.shape({}),
      categoryExclusions: PropTypes.arrayOf(PropTypes.string),
      cookieOptions: PropTypes.number,
      tagForChildDirectedTreatment: PropTypes.number,
    }),
  };

  static defaultProps = {
    json: null,
    width: 300,
    height: 250,
  };

  constructor(props) {
    super(props);
    const { slot, slotName, slotPosition, item } = props;
    const name = slotName.replace(/\s+/g, '_');
    const position = slotPosition.replace(/\s+/g, '_');
    this.divId = `div-gpt-ad-${slot}-${name}-${position}-${item.mstId}`;
  }

  render() {
    const { isAmp, slot, width, height, json } = this.props;

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
          type="doubleclick"
          data-slot={slot}
          width={width}
          height={height}
          json={json ? JSON.stringify(json) : null}
        />,
      ];
    }

    return (
      <Fragment>
        <Helmet>
          <script src="//www.googletagservices.com/tag/js/gpt.js" async />
        </Helmet>
        <AdContainer
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `<div id="${this.divId}"></div>`,
          }}
        />
        <Script func={call} args={[this.divId, slot, width, height, json]} />
      </Fragment>
    );
  }
}

export default DoubleClick;

const AdContainer = styled.div`
  & > div {
    display: block;
    width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width)};
    height: ${({ height }) =>
      typeof height === 'number' ? `${height}px` : height};
  }
`;
