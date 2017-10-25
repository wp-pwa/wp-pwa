import React from 'react';
import { Helmet } from 'react-helmet';

class Form extends React.Component {
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
          <input name="siteId" type="text" value={this.state.siteId} onChange={this.handleChange} />
        </label>{' '}
        <input style={{ background: 'lightgrey' }} type="submit" value="Submit" />
      </form>
    );
  }
}

export default () => (
  <div>
    <Helmet>
      <title>WP-PWA - Site ID missing</title>
    </Helmet>
    <Form />
  </div>
);
