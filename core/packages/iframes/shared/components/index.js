import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { Fill } from 'react-slot-fill';
import LazyIframe from './LazyIframe';

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

export default inject(({ stores: { settings, build } }) => ({
  iframes:
    (settings.theme.iframes &&
      settings.theme.iframes.filter(({ device: iframeDevice }) => iframeDevice === build.device)) ||
    [],
}))(Iframes);
