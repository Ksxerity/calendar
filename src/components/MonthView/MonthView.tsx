import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { AppDispatch, RootState } from '../../store/store';
import { selectNewDate } from '../../store/dateSlice';
import { ISelectedDate, IDateEvent } from '../../store/dateTypes';
import * as util from '../../util';
import styles from './MonthView.module.scss';

type WeekProps = {
  dates: Array<util.DayType>,
  last: boolean,
  selectedDate: ISelectedDate,
};

const Week = ({ dates, last, selectedDate }: WeekProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const getCurrentWeekEvents = createSelector(
    (state: RootState) => state.date.events,
    (events: IDateEvent[]) => events.filter((event: IDateEvent) => {
      if (event.from.year === selectedDate.year && event.from.month === selectedDate.month) {
        if (!last && dates[0].day > dates[dates.length - 1].day) return event.from.day <= dates[dates.length - 1].day;
        if (last) return dates[0].day <= event.from.day;
        if (dates[0].day <= event.from.day && event.from.day <= dates[dates.length - 1].day) {
          return true;
        }
      }
      return false;
    }),
  );
  const events = useSelector(getCurrentWeekEvents);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
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
    const currentEvents: Array<JSX.Element> = [];
    // events.forEach((event: IDateEvent) => {
    //   if (dates[i].color === 'black') {

    //   }
    // });
    days.push(
      <button
        key={`day_${dates[i].day}`}
        type="button"
        style={{ color: `${dates[i].color}` }}
        className={[
          styles.day,
          last ? styles.last : null,
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
  }

  return (
    <div className={styles.week}>
      {days}
    </div>
  );
};

const MonthView = (): JSX.Element => {
  const selectedDate = useSelector((state: RootState) => state.date.selectedDate);
  const daysInMonth: Array<Array<util.DayType>> = util.getMonthArray(selectedDate.month, selectedDate.year);

  const week: Array<JSX.Element> = [];
  week.push(
    <div key="days_of_week" className={styles['days-of-week']}>
      <div>Sunday</div>
      <div>Monday</div>
      <div>Tuesday</div>
      <div>Wednesday</div>
      <div>Thursday</div>
      <div>Friday</div>
      <div>Saturday</div>
    </div>,
  );
  for (let i = 0; i < daysInMonth.length; i++) {
    week.push(<Week key={`week_${i}`} dates={daysInMonth[i]} last={i === daysInMonth.length - 1} selectedDate={selectedDate} />);
  }

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

export default MonthView;
