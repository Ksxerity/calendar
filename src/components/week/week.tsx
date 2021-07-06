import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { selectNewDate } from '../../store/dateSlice';
import { ISelectedDate } from '../../store/dateTypes';
import * as util from '../../util';
import styles from './week.module.scss';

let selectedDate: ISelectedDate;
let dispatch: AppDispatch;

const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  const style: string = (event.currentTarget.getAttribute('style') || '');
  const newDate: ISelectedDate = { ...selectedDate };
  newDate.day = parseInt(event.currentTarget.innerHTML, 10);
  if (style) {
    let color: string = style.split(':')[1].trim();
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
  date: util.DayType
};

const Day = ({ date }: WeekProps): JSX.Element => {
  return (
    <button
      type="button"
      style={{ color: `${date.color}` }}
      className={[
        styles.day,
        (date.day === selectedDate.day && date.color === 'black') ? styles.selected : null,
      ].join(' ')}
      onClick={handleClick}
    >
      {date.day}
    </button>
  );
};

const Week = (): JSX.Element => {
  selectedDate = useSelector((state: RootState) => state.date.selectedDate);
  dispatch = useDispatch<AppDispatch>();
  const daysInWeek: Array<util.DayType> = util.getWeekArray(selectedDate.day, selectedDate.month, selectedDate.year);

  const week: Array<JSX.Element> = [];
  for (let i = 0; i < daysInWeek.length; i++) {
    week.push(<Day date={daysInWeek[i]} />);
  }

  return (
    <div className={styles.week}>
      {week}
    </div>
  );
};

export default Week;
