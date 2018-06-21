/* eslint-disable import/prefer-default-export */
import React from 'react';
import PropTypes from 'prop-types';
import Disqus from './Disqus';

const Comments = ({ type, id, shortname }) =>
  shortname ? <Disqus type={type} id={id} shortname={shortname} /> : null;

Comments.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  shortname: PropTypes.string.isRequired,
};

export { Comments };
