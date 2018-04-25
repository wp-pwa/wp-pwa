import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Fill } from 'react-slot-fill';
import LazyIframe from './LazyIframe';
import { getIframesForMobile } from '../selectors';

const Iframes = ({ iframes }) =>
  iframes.map(props => (
    <Fill key={props.name} name={props.name}>
      <LazyIframe {...props} />
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
