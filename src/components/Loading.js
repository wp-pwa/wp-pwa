import React from 'react'
import styles from '../css/Loading.css'

export default ({ page }) =>
  <div className={styles[page]}>
    <div className={styles.spinner}>
      <div />
    </div>
  </div>
