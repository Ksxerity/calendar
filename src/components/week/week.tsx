import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { selectNewDate } from '../../store/dateSlice';
import { ISelectedDate } from '../../store/dateTypes';
import * as util from '../../util';
import styles from './week.module.scss';

type WeekProps = {
  date: util.DayType,
  selectedDate: ISelectedDate,
};

const Day = ({ date, selectedDate }: WeekProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const style: string = (event.currentTarget.getAttribute('style') || '');
    const newDate: ISelectedDate = { ...selectedDate };
    newDate.day = parseInt(event.currentTarget.innerHTML, 10);
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
  const selectedDate = useSelector((state: RootState) => state.date.selectedDate);
  const daysInWeek: Array<util.DayType> = util.getWeekArray(selectedDate.day, selectedDate.month, selectedDate.year);

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

export default Week;
