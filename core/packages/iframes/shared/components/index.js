import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import { Fill } from 'react-slot-fill';
import { getIframesForMobile } from '../selectors';

const Iframes = ({ iframes }) =>
  iframes.map(({ name, src, className, width, height }) => (
    <Fill key={name} name={name}>
      <Iframe
        title={name}
        src={src}
        className={className}
        width={0}
        height={0}
        minWidth={width}
        minHeight={height}
        style={{
          margin: '0 auto',
          display: 'block',
          border: 'none',
        }}
      />
    </Fill>
  ));

Iframes.propTypes = {
  iframes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
      className: PropTypes.string,
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ),
};

const mapStateToProps = state => ({
  iframes: getIframesForMobile(state),
});

export default connect(mapStateToProps)(Iframes);

const Iframe = styled.iframe`
  min-width: ${({ minWidth }) => minWidth};
  min-height: ${({ minHeight }) => minHeight};
`;
