import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { computed } from 'mobx';
import styled from 'styled-components';
import Lazy from '../LazyUnload';

import AdSense from './AdSense';
import SmartAd from './SmartAd';
import DoubleClick from './DoubleClick';
import SunMedia from './SunMedia';

const mapAds = {
  adsense: AdSense,
  smartads: SmartAd,
  doubleclick: DoubleClick,
  sunmedia: SunMedia,
};

const Ad = ({
  type,
  width,
  height,
  active,
  isAmp,
  isSticky,
  isLazy,
  isMedia,
  ...adProps
}) => {
  const SelectedAd = mapAds[type];

  if (!SelectedAd) return null;

  if (isAmp) {
    return (
      <Container className="ad" isSticky={isSticky} styles={{ width, height }}>
        <SelectedAd width={width} height={height} isAmp={isAmp} {...adProps} />
      </Container>
    );
  }

  return (
    <Container className="ad" isSticky={isSticky} styles={{ width, height }}>
      <IconContainer>
        <IconText>ad</IconText>
      </IconContainer>
      <StyledLazy
        active={active}
        offset={1000}
        debounce={false}
        minTime={2000}
        maxTime={3000}
        isLazy={isLazy}
      >
        <SelectedAd
          isMedia={isMedia}
          width={width}
          height={height}
          isAmp={isAmp}
          {...adProps}
          active={active}
        />
      </StyledLazy>
    </Container>
  );
};

Ad.propTypes = {
  type: PropTypes.string,
  src: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  active: PropTypes.bool.isRequired,
  isAmp: PropTypes.bool.isRequired,
  isSticky: PropTypes.bool,
  isMedia: PropTypes.bool,
  isLazy: PropTypes.bool,
};

Ad.defaultProps = {
  type: 'smartads',
  src: null,
  width: 320,
  height: 80,
  isSticky: false,
  isMedia: false,
  isLazy: true,
};

export default inject(
  ({ stores: { settings, connection, build } }, { item, active }) => ({
    isAmp: build.isAmp,
    isLazy:
      settings.ads && settings.ads.settings && settings.ads.settings.areLazy,
    active:
      typeof active === 'boolean'
        ? active
        : computed(
            () =>
              (item &&
                connection.selectedContext.getItem({ item }).isSelected) ||
              false,
          ).get(),
  }),
)(Ad);

const Container = styled.div`
  margin: ${({ isSticky }) => (isSticky ? '' : '10px auto')};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: calc(100% - 30px);
  min-height: ${({ styles }) =>
    typeof styles.height === 'string'
      ? `calc(${styles.height} + 1px)`
      : `${styles.height + 1}px`};
  width: ${({ styles }) =>
    typeof styles.width === 'string' ? styles.width : `${styles.width}px`};
  overflow: hidden;

  * {
    max-width: 100%;
  }
`;

const IconContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconText = styled.span`
  margin: 0;
  padding: 3px 5px;
  font-size: 20px;
  line-height: 20px;
  color: #bdbdbd;
  text-transform: uppercase;
  border: 3px solid #bdbdbd;
  border-radius: 4px;
`;

const StyledLazy = styled(Lazy)`
  position: static;
  top: 0;
  left: 0;
  min-height: ${({ height }) =>
    typeof height === 'string' ? height : `${height}px`};
  width: ${({ width }) => (typeof width === 'string' ? width : `${width}px`)};
  z-index: 1;
`;
