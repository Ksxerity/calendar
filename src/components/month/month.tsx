import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { selectNewDate } from '../../store/dateSlice';
import * as util from '../../util';
import styles from './month.module.scss';

type WeekProps = {
  dates: Array<number>
};

const Week = ({ dates }: WeekProps) => {
  const days = [];
  for (let i = 0; i < dates.length; i++) {
    days.push(<div className={styles.day}>{dates[i]}</div>);
  }

  return (
    <div className={styles.week}>
      {days}
    </div>
  );
};
const Month = () => {
  const selectedDate = useSelector((state: RootState) => state.date.selectedDate);
  const dispatch = useDispatch<AppDispatch>();
  const daysInMonth = util.getMonthArray(selectedDate.month, selectedDate.year);

  return (
    <div className={styles['month-5']}>
      <Week dates={daysInMonth[0]} />
      <Week dates={daysInMonth[1]} />
      <Week dates={daysInMonth[2]} />
      <Week dates={daysInMonth[3]} />
      <Week dates={daysInMonth[4]} />
    </div>
  );
};

export default Month;
