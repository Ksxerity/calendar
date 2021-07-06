import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import styles from './home.module.scss';
import {
  Actions,
  Day,
  Month,
  Selector,
  Week,
} from '../../components';

const Home = () => {
  const calendarView: string = useSelector((state: RootState) => state.date.calendarView);
  let calendarType: JSX.Element;

  if (calendarView === 'month') {
    calendarType = <Month />;
  } else if (calendarView === 'week') {
    calendarType = <Week />;
  } else {
    calendarType = <Day />;
  }

  return (
    <div className={styles.home}>
      <div className={styles.actions}>
        <Actions />
      </div>
      <div className={styles['month-selector']}>
        <Selector />
      </div>
      <div className={styles.calendar}>
        {calendarType}
      </div>
    </div>
  );
};

export default Home;
