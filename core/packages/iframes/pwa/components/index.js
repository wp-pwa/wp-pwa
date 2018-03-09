import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Fill } from 'react-slot-fill';

const iframeSettings = [
  {
    name: 'iframe1',
    src: 'https://example.com/',
    width: '100%',
    height: 400,
  },
  {
    name: 'iframe2',
    src: 'https://example.com/',
    width: '100%',
    height: 300,
  },
  {
    name: 'iframe3',
    src: 'https://example.com/',
    width: '100%',
    height: 300,
  },
  {
    name: 'iframe4',
    src: 'https://example.com/',
    width: '100%',
    height: 600,
  },
];

const Iframes = ({ settings }) =>
  settings.map(({ name, src, width, height }) => (
    <Fill key={name} name={name}>
      <iframe
        title={name}
        src={src}
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
  settings: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    }),
  ),
};

const mapStateToProps = () => ({
  settings: iframeSettings,
});

export default connect(mapStateToProps)(Iframes);
