import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { selectNewDate } from '../../store/dateSlice';
import { IDateEvent, IEventTime } from '../../store/dateTypes';
import * as util from '../../util';
import styles from './MonthView.module.scss';

type WeekProps = {
  dates: Array<util.DayType>,
  last: boolean,
  selectedDate: Date,
  priority: Array<number>,
};

const Week = (props: WeekProps): JSX.Element => {
  const {
    dates,
    last,
    selectedDate,
    priority,
  } = props;
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const style: string = (event.currentTarget.getAttribute('style') || '');
    const day = parseInt(event.currentTarget.children[0].innerHTML, 10);
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
      dispatch(selectNewDate(new Date(year, month, day, selectedDate.getHours())));
    }
  };

  const days: Array<JSX.Element> = [];
  for (let i = 0; i < dates.length; i++) {
    const events = useSelector(util.dayEventSelector(dates[i].date));
    // events.sort((a, b) => {

    // });
    // let eventArray = new Array(5).fill(<div />);
    // events.forEach((event) => {
    //   // if (priority.includes(event.id)) {
    //   //   eventArray[priority.indexOf(event.id)] = <div className={styles.event}>{event.name}</div>;
    //   // } else if (prior
    //   eventArray
    // });
    days.push(
      <button
        key={`day_${dates[i].date.getDate()}`}
        type="button"
        style={{ color: `${dates[i].color}` }}
        className={[
          styles.day,
          last ? styles.last : null,
          (dates[i].date.getDate() === selectedDate.getDate() && dates[i].color === 'black') ? styles.selected : null,
        ].join(' ')}
        onClick={handleClick}
      >
        <div className={styles.date}>
          {dates[i].date.getDate()}
        </div>
        {/* <div className={[styles.event, styles.start, styles.green].join(' ')}>Event 1 with a super long name</div> */}
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
  const daysInMonth: Array<Array<util.DayType>> = util.getMonthArray(selectedDate);
  const priority = new Array(4).fill(null);

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
    week.push(
      <Week
        key={`week_${i}`}
        dates={daysInMonth[i]}
        last={i === daysInMonth.length - 1}
        selectedDate={selectedDate}
        priority={priority}
      />,
    );
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
