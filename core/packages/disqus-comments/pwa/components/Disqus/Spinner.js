/*
  eslint no-mixed-operators: 0,
  react/no-array-index-key: 0
*/

import React from 'react';
import styled, { keyframes } from 'react-emotion';

const Spinner = () => {
  const circles = Array(12)
    .fill()
    .map((item, index) => <Circle key={index} circle={index} />);

  return (
    <Container>
      <Wrapper>{circles}</Wrapper>
    </Container>
  );
};

export default Spinner;

const skCircleFadeDelay = keyframes`
  0%, 39%, 100% { opacity: 0; }
  40% { opacity: 1; }
`;

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 40px;
  height: 40px;
  position: relative;
`;

const Circle = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  transform: ${({ circle }) => `rotate(${30 * circle}deg)`};

  &:before {
    content: '';
    display: block;
    margin: 0 auto;
    width: 15%;
    height: 15%;
    background-color: #333;
    border-radius: 100%;
    animation: ${skCircleFadeDelay} 1.2s infinite ease-in-out both;
    animation-delay: ${({ circle }) => -1.1 + circle / 10}s;
  }
`;
