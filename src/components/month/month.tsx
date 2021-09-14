import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { selectNewDate } from '../../store/dateSlice';
import { ISelectedDate } from '../../store/dateTypes';
import * as util from '../../util';
import styles from './month.module.scss';

type WeekProps = {
  dates: Array<util.DayType>,
  last: boolean,
  selectedDate: ISelectedDate,
};

const Week = ({ dates, last, selectedDate }: WeekProps): JSX.Element => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const dispatch = useDispatch<AppDispatch>();
    const style: string = (event.currentTarget.getAttribute('style') || '');
    const newDate: ISelectedDate = { ...selectedDate };
    newDate.day = parseInt(event.currentTarget.children[0].innerHTML, 10);
    if (style) {
      let color: string = style.split(':')[1].trim();
      color = color.slice(0, color.length - 1);
      if (color === 'gray') {
        if (newDate.day > 15) {
          const { month, year } = util.calculatePrevMonthAndYear(newDate.month, newDate.year);
          newDate.month = month;
          newDate.year = year;
        } else {
          const { month, year } = util.calculateNextMonthAndYear(newDate.month, newDate.year);
          newDate.month = month;
          newDate.year = year;
        }
      }
      dispatch(selectNewDate(newDate));
    }
  };

  const days: Array<JSX.Element> = [];
  for (let i = 0; i < dates.length; i++) {
    if (last) {
      days.push(
        <button
          type="button"
          style={{ color: `${dates[i].color}` }}
          className={[
            styles.day,
            styles.last,
            (dates[i].day === selectedDate.day && dates[i].color === 'black') ? styles.selected : null,
          ].join(' ')}
          onClick={handleClick}
        >
          <div className={styles.date}>
            {dates[i].day}
          </div>
          {/* <div className={styles.event}>Event 1 with a super long name</div>
          <div className={styles.event}>Event 2</div> */}
        </button>,
      );
    } else {
      days.push(
        <button
          type="button"
          style={{ color: `${dates[i].color}` }}
          className={[
            styles.day,
            (dates[i].day === selectedDate.day && dates[i].color === 'black') ? styles.selected : null,
          ].join(' ')}
          onClick={handleClick}
        >
          <div className={styles.date}>
            {dates[i].day}
          </div>
        </button>,
      );
    }
  }

  return (
    <div className={styles.week}>
      {days}
    </div>
  );
};

const Month = (): JSX.Element => {
  const selectedDate = useSelector((state: RootState) => state.date.selectedDate);
  const daysInMonth: Array<Array<util.DayType>> = util.getMonthArray(selectedDate.month, selectedDate.year);

  const week: Array<JSX.Element> = [];
  week.push(
    <div className={styles['days-of-week']}>
      <div>Sunday</div>
      <div>Monday</div>
      <div>Tuesday</div>
      <div>Wednesday</div>
      <div>Thursday</div>
      <div>Friday</div>
      <div>Saturday</div>
    </div>,
  );
  for (let i = 0; i < daysInMonth.length - 1; i++) {
    week.push(<Week dates={daysInMonth[i]} last={false} selectedDate={selectedDate} />);
  }
  week.push(<Week dates={daysInMonth[daysInMonth.length - 1]} last={true} selectedDate={selectedDate} />);

  let monthView: string;
  if (daysInMonth.length === 4) {
    monthView = styles['month-4'];
  } else if (daysInMonth.length === 5) {
    monthView = styles['month-5'];
  } else {
    monthView = styles['month-6'];
  }
  return (
    <div className={monthView}>
      {week}
    </div>
  );
};

export default Month;
