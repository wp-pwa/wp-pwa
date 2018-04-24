import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { Helmet } from 'react-helmet';

let firstAd = true;
let counter = 0;

class DoubleClick extends PureComponent {
  static propTypes = {
    slot: PropTypes.string.isRequired,
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
    this.divId = `div-gpt-ad-${props.slot}-${(counter += 1)}`;
  }

  componentDidMount() {
    const { slot, width, height, json } = this.props;
    const {
      targeting,
      categoryExclusions,
      cookieOptions,
      tagForChildDirectedTreatment: tagForChild,
    } =
      json || {};

    if (window) {
      if (firstAd) {
        firstAd = false;

        // Initialize GTP
        window.googletag = window.googletag || {};
        window.googletag.cmd = window.googletag.cmd || [];
      }

      window.googletag.cmd.push(() => {
        // Define ad
        const ad = window.googletag
          .defineSlot(slot, [width, height], this.divId)
          .addService(window.googletag.pubads());

        // Extra options
        if (targeting !== undefined) {
          Object.entries(targeting).forEach(([key, value]) => ad.setTargeting(key, value));
        }
        if (categoryExclusions !== undefined) {
          categoryExclusions.forEach(exclusion => ad.setCategoryExclusion(exclusion));
        }
        if (cookieOptions !== undefined) {
          ad.setCookieOptions(cookieOptions);
        }
        if (tagForChild !== undefined) {
          ad.setTagForChildDirectedTreatment(tagForChild);
        }

        // Display ad
        window.googletag.enableServices();
        window.googletag.display(this.divId);
      });
    }
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
        <AdContainer id={this.divId} />
      </Fragment>
    );
  }
}

export default DoubleClick;

const AdContainer = styled.div`
  display: inline-block;
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width)};
  height: ${({ height }) => (typeof height === 'number' ? `${height}px` : height)};
`;
