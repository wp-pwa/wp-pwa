import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Fill } from 'react-slot-fill';
import { getIframesForMobile } from '../selectors';

const Iframes = ({ iframes }) =>
  iframes.map(({ name, src, className, width, height }) => (
    <Fill key={name} name={name}>
      <iframe
        title={name}
        src={src}
        className={className}
        width={width}
        height={height}
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
