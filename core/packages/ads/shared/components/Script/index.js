/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';

class Script extends React.Component {
  constructor(props) {
    super(props);
    this.isSsr = props.isSsr;
    this.node = React.createRef();
  }

  componentDidMount() {
    if (!this.isSsr) {
      const script = window.document.createElement('script');
      script.textContent = this.textContent();
      this.node.current.appendChild(script);
    }
  }

  textContent = () => {
    const { func, args } = this.props;
    return `(function(){${func} func(${args
      .map(JSON.stringify)
      .join(',')})})();`;
  };

  render() {
    const tag = 'script';
    return this.isSsr ? (
      <span
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `<${tag}>${this.textContent()}</${tag}>`,
        }}
      />
    ) : (
      <span ref={this.node} />
    );
  }
}

Script.propTypes = {
  func: PropTypes.string.isRequired,
  args: PropTypes.arrayOf(PropTypes.any),
  isSsr: PropTypes.bool.isRequired,
};

Script.defaultProps = {
  args: [],
};

export default inject(({ stores }) => ({
  isSsr: stores.build.isSsr,
}))(Script);
