import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import styles from './Home.module.scss';
import {
  Actions,
  DayView,
  MonthView,
  Selector,
  WeekView,
} from '../../components';

const Home = () => {
  const calendarView: string = useSelector((state: RootState) => state.date.calendarView);
  let calendarType: JSX.Element;

  if (calendarView === 'month') {
    calendarType = <MonthView />;
  } else if (calendarView === 'week') {
    calendarType = <WeekView />;
  } else {
    calendarType = <DayView />;
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
