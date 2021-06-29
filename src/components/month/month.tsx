import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { selectNewDate } from '../../store/dateSlice';
import { ISelectedDate } from '../../store/dateTypes';
import * as util from '../../util';
import styles from './month.module.scss';

let selectedDate: ISelectedDate;
let dispatch: AppDispatch;
let daysInMonth: Array<Array<util.DayType>>;

const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  const style = event.currentTarget.getAttribute('style');
  const newDate = { ...selectedDate };
  newDate.day = parseInt(event.currentTarget.innerHTML, 10);
  if (style) {
    let color = style.split(':')[1].trim();
    color = color.slice(0, color.length - 1);
    if (color === 'gray') {
      if (newDate.day > 15) {
        if (newDate.month === 0) {
          newDate.month = 11;
          newDate.year -= 1;
        } else {
          newDate.month -= 1;
        }
      } else if (newDate.month === 11) {
        newDate.month = 0;
        newDate.year += 1;
      } else {
        newDate.month += 1;
      }
    }
    dispatch(selectNewDate(newDate));
  }
};

type WeekProps = {
  dates: Array<util.DayType>,
  last: boolean,
};

const Week = ({ dates, last }: WeekProps): JSX.Element => {
  const days = [];
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
          {dates[i].day}
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
          {dates[i].day}
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
  selectedDate = useSelector((state: RootState) => state.date.selectedDate);
  dispatch = useDispatch<AppDispatch>();
  daysInMonth = util.getMonthArray(selectedDate.month, selectedDate.year);

  const week = [];
  for (let i = 0; i < daysInMonth.length - 1; i++) {
    week.push(<Week dates={daysInMonth[i]} last={false} />);
  }
  week.push(<Week dates={daysInMonth[daysInMonth.length - 1]} last={true} />);

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
