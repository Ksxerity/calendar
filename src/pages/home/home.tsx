import React from 'react';
import styles from './home.module.scss';
import {
  // Action,
  // Day,
  Month,
  Selector,
  // Week
} from '../../components';

const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.actions}>
        <div className={styles.circle} />
        <div className={styles.circle} />
        <div className={styles.circle} />
        <div className={styles.circle} />
        <div className={styles.circle} />
      </div>
      <div className={styles['month-selector']}>
        <Selector />
      </div>
      <div className={styles.calendar}>
        <Month />
      </div>
    </div>
  );
};

export default Home;
