import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import Icon from './Icon';

const ErrorMessage = () => (
  <Fragment>
    <Helmet>
      <style>{'body{margin:0}'}</style>
    </Helmet>
    <Container>
      <span>
        Oops! Something went wrong. Try{' '}
        <strong>https://blog.frontity.com</strong> to see a full version.
      </span>
      <Gap />
      <a href="https://blog.frontity.com">
        <Button>
          <Icon />
          see our blog
        </Button>
      </a>
    </Container>
  </Fragment>
);

export default ErrorMessage;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 32px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: Poppins, sans-serif;
  font-size: 20px;
  text-align: center;
  color: #0c112b;

  a,
  a:visited {
    color: #0c112b;
    text-decoration: none;
  }
`;

const Gap = styled.div`
  height: 80px;
`;

const Button = styled.div`
  padding: 6px 12px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border: 2px solid rgba(12, 17, 43, 0.4);
  border-radius: 8px;
  box-shadow: 0 4px 8px 0 rgba(12, 17, 43, 0.12),
    0 1px 4px 0 rgba(12, 17, 43, 0.16);

  svg {
    margin-right: 8px;
  }
`;
