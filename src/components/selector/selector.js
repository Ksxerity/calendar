import React from 'react';
import styles from './selector.module.scss';
import {
  LeftArrow,
  RightArrow
} from '../../assets'

const Selector = () => {
  return (
    <div className={styles.selector}>
      <a className={styles["select-prev"]}>
        <img src={LeftArrow}></img>
      </a>
      <a className={styles["select-month"]}>Month</a>
      <a className={styles["select-next"]}>
        <img src={RightArrow}></img>
      </a>
    </div>
  )
}

export default Selector;