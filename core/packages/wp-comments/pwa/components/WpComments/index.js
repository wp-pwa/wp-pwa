import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import styled from 'styled-components';
import Comment from './Comment';

class WpComments extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  onSubmit(e) {
    e.preventDefault();
    const { id, create } = this.props;
    create({ id, ...this.state });
  }

  render() {
    return (
      <Container>
        {this.props.comments.map(props => (
          <Comment key={props.id} {...props} />
        ))}
        <Form onSubmit={this.onSubmit}>
          <h3>Leave a reply</h3>
          <Label htmlFor="content">
            <span>Comment</span>
            <TextArea
              id="content"
              name="content"
              cols="45"
              rows="8"
              maxLength="65525"
              required="required"
              value={this.state.content || ''}
              onChange={this.onChange}
            />
          </Label>
          <Label htmlFor="name">
            <span>Name</span>
            <Input
              id="name"
              name="name"
              type="text"
              value={this.state.name || ''}
              onChange={this.onChange}
              size="30"
              maxLength="245"
              required="required"
            />
          </Label>
          <Label htmlFor="email">
            <span>Email</span>
            <Input
              id="email"
              name="email"
              type="email"
              value={this.state.email || ''}
              onChange={this.onChange}
              size="30"
              maxLength="100"
              aria-describedby="email-notes"
              required="required"
            />
          </Label>
          <Label htmlFor="url">
            <span>Webstite</span>
            <Input
              id="url"
              name="url"
              type="url"
              value={this.state.url || ''}
              onChange={this.onChange}
              size="30"
              maxLength="200"
            />
          </Label>
          <Button
            name="submit"
            type="submit"
            id="submit"
            className="submit"
            value="Post Comment"
          />
        </Form>
      </Container>
    );
  }
}

WpComments.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const Container = styled.div`
  padding: 16px;
`;

const Form = styled.form``;
const Label = styled.label`
  margin-top: 16px;
  display: flex;
  flex-direction: column;

  & > span {
    font-weight: bold;
  }
`;

const TextArea = styled.textarea`
  background: white;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 0 8px;
  font-size: 16px;
  line-height: 24px;
`;

const Input = styled.input`
  background: white;
  padding: 0 8px;
  border: 1px solid #eee;
  border-radius: 4px;
  font-size: 16px;
  line-height: 24px;
`;

const Button = styled.input`
  display: block;
  margin: 16px 0;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid #eee;
  border-radius: 4px;
  font-size: 16px;
  line-height: 24px;
`;

export default inject(({ stores: { comments } }, { type, id }) => ({
  comments: comments.get({ type, id }),
  create: comments.create,
}))(WpComments);
