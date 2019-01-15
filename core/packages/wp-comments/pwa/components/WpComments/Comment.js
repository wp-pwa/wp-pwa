import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Comment = ({ name, avatar, date, content }) => (
  <Container>
    <Header>
      <Avatar>
        <img alt="avatar" src={avatar} />
      </Avatar>
      <Text>
        <Name>{name}</Name>
        <Fecha>{date.toLocaleString()}</Fecha>
      </Text>
    </Header>
    <Content dangerouslySetInnerHTML={{ __html: content }} />
  </Container>
);

const Container = styled.div`
  margin-top: 32px;
`;
const Header = styled.div`
  display: flex;
`;
const Avatar = styled.div`
  margin-right: 16px;
  width: 48px;
  height: 48px;

  img {
    width: 100%;
    height: 100%;
  }
`;
const Text = styled.div``;
const Name = styled.div`
  font-weight: bold;
`;
const Fecha = styled.div``;
const Content = styled.div``;

Comment.propTypes = {
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  content: PropTypes.string.isRequired,
};

export default Comment;
