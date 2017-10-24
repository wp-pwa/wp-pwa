import React from 'react';
import styled from 'react-emotion';
import styles from '../../../css/Foo.css';

const RedDiv = styled.div`color: red;`;

export default () => (
  <div className={styles.container}>
    <RedDiv>Im red</RedDiv>
    <div css="color: green;">
      Im green
    </div>
    <span>Foo -- loaded</span>
  </div>
);
