import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Fill } from 'react-slot-fill';

const iframeSettings = [
  {
    id: 'aaa',
    src: 'https://example.com/',
    width: '100%',
    height: 400,
  },
  {
    id: 'bbb',
    src: 'https://example.com/',
    width: '100%',
    height: 400,
  },
];

const Iframes = ({ settings }) =>
  settings.map(({ id, src, width, height }) => (
    <Fill key={id} name={id}>
      <iframe
        title={id}
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
      id: PropTypes.string.isRequired,
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
