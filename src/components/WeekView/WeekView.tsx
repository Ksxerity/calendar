import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { AppDispatch, RootState } from '../../store/store';
import { selectNewDate } from '../../store/dateSlice';
import { IDateEvent } from '../../store/dateTypes';
import * as util from '../../util';
import styles from './WeekView.module.scss';

type WeekProps = {
  date: util.DayType,
  selectedDate: Date,
};

const Day = ({ date, selectedDate }: WeekProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const style: string = (event.currentTarget.getAttribute('style') || '');
    const day = parseInt(event.currentTarget.innerHTML, 10);
    let month = selectedDate.getMonth();
    let year = selectedDate.getFullYear();
    if (style) {
      let color: string = style.split(':')[1].trim();
      color = color.slice(0, color.length - 1);
      if (color === 'gray') {
        if (day > 15) {
          const prevMonthAndYear = util.calculatePrevMonthAndYear(month, year);
          month = prevMonthAndYear.month;
          year = prevMonthAndYear.year;
        } else {
          const nextMonthAndYear = util.calculateNextMonthAndYear(month, year);
          month = nextMonthAndYear.month;
          year = nextMonthAndYear.year;
        }
      }
      dispatch(selectNewDate(new Date(year, month, day, selectedDate.getHours()).toString()));
    }
  };

  return (
    <button
      type="button"
      style={{ color: `${date.color}` }}
      className={[
        styles.day,
        (date.date.getDate() === selectedDate.getDate() && date.color === 'black') ? styles.selected : null,
      ].join(' ')}
      onClick={handleClick}
    >
      {date.date.getDate()}
    </button>
  );
};

const WeekView = (): JSX.Element => {
  const selectedDate = new Date(useSelector((state: RootState) => state.date.selectedDate));
  const daysInWeek: Array<util.DayType> = util.getWeekArray(selectedDate);

  const week: Array<JSX.Element> = [];
  week.push(<div key="sunday" className={styles['day-of-week']}>Sunday</div>);
  week.push(<div key="monday" className={styles['day-of-week']}>Monday</div>);
  week.push(<div key="tuesday" className={styles['day-of-week']}>Tuesday</div>);
  week.push(<div key="wednesday" className={styles['day-of-week']}>Wednesday</div>);
  week.push(<div key="thursday" className={styles['day-of-week']}>Thursday</div>);
  week.push(<div key="friday" className={styles['day-of-week']}>Friday</div>);
  week.push(<div key="saturday" className={styles['day-of-week']}>Saturday</div>);
  for (let i = 0; i < daysInWeek.length; i++) {
    week.push(<Day key={`week${i}`} date={daysInWeek[i]} selectedDate={selectedDate} />);
  }

  return (
    <div className={styles.week}>
      {week}
    </div>
  );
};

export default WeekView;
