import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Fill } from 'react-slot-fill';
import { dep } from 'worona-deps';
import Iframe from './iframe';
import { getIframesForMobile } from '../selectors';

const Iframes = ({ iframes, ssr }) =>
  iframes.map(({ name, src, className, width, height }) => (
    <Fill key={name} name={name}>
      <Iframe
        title={name}
        src={src}
        className={className}
        width={width}
        height={height}
        ssr={ssr}
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
  ssr: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  iframes: getIframesForMobile(state),
  ssr: dep('build', 'selectors', 'getSsr')(state),
});

export default connect(mapStateToProps)(Iframes);
