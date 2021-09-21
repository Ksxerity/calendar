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
  prevWeekPriorityOrder: Array<number | null>,
  setPrevWeekPriorityOrder: ((arr: Array<number | null>) => void),
};

const Week = (props: WeekProps): JSX.Element => {
  const {
    dates,
    last,
    selectedDate,
    prevWeekPriorityOrder,
    setPrevWeekPriorityOrder,
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
      dispatch(selectNewDate(new Date(year, month, day, selectedDate.getHours()).toString()));
    }
  };

  const days: Array<JSX.Element> = [];
  const nextPriority = [...prevWeekPriorityOrder]; // A separate listing that ONLY has long events
  for (let i = 0; i < dates.length; i++) {
    const currentPriority = [...nextPriority]; // A copy of the priority listing to be filled with events from today
    const events = useSelector(util.dayEventSelector(dates[i].date));
    events.sort((a, b) => new Date(a.from).valueOf() - new Date(b.from).valueOf()); // Sort by start time
    const eventArray = new Array(5).fill(<div />);
    /**
     * PRIORITY LOGIC:
     * Events are sorted by start time.
     * That means all events that are multi-day events will be prioritized first
     *    If event already has a priority listing, continue to use that slot
     *    If event does not have a priority listing, then find the next available slot
     * If the event starts and ends this day, add it to the next available slot
     * If all slots are filled, just add a "..." div to the end
     */
    for (let j = 0; j < events.length; j++) {
      const event = events[j];
      const currentDate = new Date(dates[i].date);
      const eventStartDate = new Date(event.from);
      const eventEndDate = new Date(event.to);
      if (!currentPriority.includes(null)) {
        // No more space for other events
        eventArray[4] = <button type="button" className={styles.event}>...</button>;
      } else if (currentPriority.includes(event.id)) {
        const index = currentPriority.indexOf(event.id);
        if (currentDate.getDate() === eventStartDate.getDate() && eventEndDate.getDate() === currentDate.getDate()) {
          // Event ends on this day
          eventArray[index] = (
            <button
              type="button"
              className={[
                styles.event,
                styles.end,
                styles[event.color],
              ].join(' ')}
            >
              {event.name}
            </button>
          );
          nextPriority[index] = null;
        } else {
          eventArray[index] = (
            <button
              type="button"
              className={[
                styles.event,
                styles[event.color],
              ].join(' ')}
            >
              {event.name}
            </button>
          );
        }
      } else if (currentDate.getDate() === eventStartDate.getDate() && eventEndDate.getDate() === currentDate.getDate()) {
        // Event starts and ends this day
        const index = currentPriority.indexOf(null);
        eventArray[index] = (
          <button
            type="button"
            className={[
              styles.event,
              styles.singular,
              styles[event.color],
            ].join(' ')}
          >
            {event.name}
          </button>
        );
        currentPriority[index] = event.id;
      } else {
        // Event has a long duration
        const index = currentPriority.indexOf(null);
        eventArray[index] = (
          <button
            type="button"
            className={[
              styles.event,
              styles.start,
              styles[event.color],
            ].join(' ')}
          >
            {event.name}
          </button>
        );
        currentPriority[index] = event.id;
        nextPriority[index] = event.id;
      }
    }
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
        {eventArray}
        {/* <div className={[styles.event, styles.start, styles.green].join(' ')}>Event 1 with a super long name</div>
        <div className={[styles.event, styles.start, styles.orange].join(' ')}>Event 1 with a super long name</div> */}
      </button>,
    );
  }
  setPrevWeekPriorityOrder(nextPriority);

  return (
    <div className={styles.week}>
      {days}
    </div>
  );
};

const MonthView = (): JSX.Element => {
  const selectedDate = new Date(useSelector((state: RootState) => state.date.selectedDate));
  const daysInMonth: Array<Array<util.DayType>> = util.getMonthArray(selectedDate);
  /**
   * Array of event ids. The index is the priority.
   * Keeps track of the order of long events from week to week
   */
  let prevWeekPriorityOrder = new Array(4).fill(null);
  const setPrevWeekPriorityOrder = (arr: Array<number | null>) => {
    prevWeekPriorityOrder = [...arr];
  };

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
        prevWeekPriorityOrder={prevWeekPriorityOrder}
        setPrevWeekPriorityOrder={(arr: Array<number | null>) => setPrevWeekPriorityOrder(arr)}
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
