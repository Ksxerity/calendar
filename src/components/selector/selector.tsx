import React from 'react';
import styles from './selector.module.scss';
import {
  LeftArrow,
  RightArrow,
} from '../../assets';

const Selector = () => {
  return (
    <div className={styles.selector}>
      <button type="button" className={styles['select-prev']}>
        <img src={LeftArrow} alt="Left arrow button" />
      </button>
      <button type="button" className={styles['select-month']}>
        Month
      </button>
      <button type="button" className={styles['select-next']}>
        <img src={RightArrow} alt="Right arrow button" />
      </button>
    </div>
  );
};

export default Selector;
