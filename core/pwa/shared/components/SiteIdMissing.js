import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import styled from 'react-emotion';

class FormClass extends React.Component {
  static propTypes = {
    env: PropTypes.string,
  }

  static defaultProps = {
    env: 'pre',
  }

  constructor(props) {
    super(props);
    this.state = { siteId: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ siteId: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    window.location.href = `/?siteId=${this.state.siteId}`; // eslint-disable-line
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="siteId">
          Please enter your Site ID:{' '}
          <Input name="siteId" type="text" value={this.state.siteId} onChange={this.handleChange} />
        </label>{' '}
        <Input type="submit" value="Submit" />
        <p>
          Make sure it is a <strong>{this.props.env === 'prod'
            ? 'PRODUCTION'
            : 'PREPRODUCTION'}
          </strong>{' '}
          Site ID.
        </p>
      </form>
    );
  }
}

const Input = styled.input`
  background-color: lightgrey;
`;

const mapState = state => ({
  env: state.build.environment,
})

const Form = connect(mapState)(FormClass);

export default () => (
  <div>
    <Helmet>
      <title>WP-PWA - Site ID missing</title>
    </Helmet>
    <Form />
  </div>
);
