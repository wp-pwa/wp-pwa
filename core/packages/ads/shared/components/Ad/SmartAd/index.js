import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject } from 'mobx-react';
import { Helmet } from 'react-helmet';
import Script from '../../Script';
import { setup, call } from './functions';

class SmartAd extends Component {
  static propTypes = {
    networkId: PropTypes.number.isRequired,
    siteId: PropTypes.number.isRequired,
    pageId: PropTypes.number.isRequired,
    formatId: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    callType: PropTypes.oneOf(['std', 'iframe']),
    target: PropTypes.string,
    isAmp: PropTypes.bool.isRequired,
    item: PropTypes.shape({
      type: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      page: PropTypes.number,
      mstId: PropTypes.string,
    }),
    slotName: PropTypes.string,
  };

  static defaultProps = {
    callType: 'iframe',
    slotName: '',
    target: null,
    item: null,
  };

  render() {
    const {
      networkId,
      formatId,
      width,
      height,
      isAmp,
      siteId,
      pageId,
      target,
      callType,
      item,
      slotName,
    } = this.props;

    const tagId = `ad${formatId}_${item.mstId}${
      slotName ? `_${slotName}` : ''
    }`;

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
          type="smartadserver"
          data-site={siteId}
          data-page={pageId}
          data-format={formatId}
          data-domain="https://www8.smartadserver.com"
          data-target={target}
          layout="fill"
        />,
      ];
    }

    return (
      <Fragment>
        <Helmet>
          <script
            src={`//ced.sascdn.com/tag/${networkId}/smart.js`}
            type="text/javascript"
            async
          />
        </Helmet>
        <InnerContainer
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `<div class="sas-ad" id="${tagId}" width="${width}" height="${height}"></div>`,
          }}
        />
        <Script func={setup} args={[networkId]} />
        <Script
          func={call}
          args={[
            callType,
            {
              siteId,
              pageId,
              formatId,
              target,
              width,
              height,
              tagId,
            },
          ]}
        />
      </Fragment>
    );
  }
}

export default inject(
  ({ stores: { connection, settings } }, { item: { type, id } }) => ({
    networkId: settings.theme.ads.settings.networkId,
    target: connection.entity(type, id).target,
  }),
)(SmartAd);

const InnerContainer = styled.div`
  & > div {
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.white};

    iframe {
      max-width: 100%;
      display: block;
    }
  }
`;
