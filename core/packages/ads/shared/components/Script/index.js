/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';

const Script = ({ func, args }) => {
  const code = `(function(){${func} f(${args
    .map(JSON.stringify)
    .join(',')})})();`;

  const scriptTag = 'script';
  return (
    <span
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `<${scriptTag}>${code}</${scriptTag}>`,
      }}
    />
  );
};

Script.propTypes = {
  func: PropTypes.string.isRequired,
  args: PropTypes.arrayOf(PropTypes.any),
};

Script.defaultProps = {
  args: [],
};

export default Script;
