import React from 'react';
import styled from 'styled-components';

const Icon = () => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="11"
    viewBox="0 0 14 11"
  >
    <g fill="currentColor" fillRule="evenodd">
      <path d="M7.651 5.5L8 5.805 2.063 11 0 9.195 4.223 5.5 0 1.805 2.063 0 8 5.195l-.349.305z" />
      <path d="M13.651 5.5l.349.305L8.063 11 6 9.195 10.223 5.5 6 1.805 8.063 0 14 5.195l-.349.305z" />
    </g>
  </Svg>
);

export default Icon;

const Svg = styled.svg`
  display: flex;
  justify-content: center;
  align-items: center;
`;
