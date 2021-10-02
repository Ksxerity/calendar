import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { selectNewDate } from '../../store/dateSlice';
import { IDateEvent, IEventTime } from '../../store/dateTypes';
import { CreateEventModal, DisplayEventModal } from '../Modals';
import * as util from '../../util';
import styles from './MonthView.module.scss';

type WeekProps = {
  dates: Array<util.DayType>,
  last: boolean,
  selectedDate: Date,
  showEvent: (eventId: number) => void,
};

const Week = (props: WeekProps): JSX.Element => {
  const {
    dates,
    last,
    selectedDate,
    showEvent,
  } = props;
  const dispatch = useDispatch<AppDispatch>();

  const handleGridClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    const date: string = (event.currentTarget.getAttribute('data-date') || '');
    if (!date) {
      const eventId: string = (event.currentTarget.getAttribute('data-event-id') || '');
      if (eventId) {
        showEvent(parseInt(eventId, 10));
      }
    } else {
      const currentDate: Date = new Date(date);
      currentDate.setHours(selectedDate.getHours());
      dispatch(selectNewDate(currentDate.toString()));
    }
  };

  const grid: Array<JSX.Element> = [];
  const datesRow: Array<JSX.Element> = [];
  for (let i = 0; i < dates.length; i++) {
    grid.push(
      <div
        role="button"
        style={{
          gridColumnStart: i + 1,
        }}
        className={[
          styles['grid-box'],
          last ? styles.last : null,
          (dates[i].date.getDate() === selectedDate.getDate() && dates[i].color === 'black') ? styles.selected : null,
        ].join(' ')}
        aria-hidden="true"
        data-color={dates[i].color}
        data-date={dates[i].date}
        onClick={handleGridClick}
      />,
    );
    datesRow.push(
      <div
        role="button"
        aria-hidden="true"
        data-color={dates[i].color}
        data-date={dates[i].date}
        style={{
          color: dates[i].color,
          gridColumnStart: i + 1,
        }}
        className={styles.date}
        onClick={handleGridClick}
      >
        {(new Date(dates[i].date)).getDate()}
      </div>,
    );
  }

  const eventsRow: Array<JSX.Element> = new Array(5);
  const eventsPos: Array<Array<number | null>> = new Array(5).fill(null).map(() => new Array(7).fill(null));
  const events: Array<IDateEvent> = useSelector(util.currentWeekEventSelector(dates, selectedDate));
  events.sort((event1, event2) => {
    // Sort by start time. Multi-day events are prioritized.
    const event1Start = new Date(event1.from);
    const event2Start = new Date(event2.from);
    const event1End = new Date(event1.to);
    const event2End = new Date(event2.to);
    if (event1Start.getFullYear() === event2Start.getFullYear()) {
      if (event1Start.getMonth() === event2Start.getMonth()) {
        if (event1Start.getDate() === event2Start.getDate()) {
          // If events start on same day, sort by duration
          return ((event2End.valueOf() - event2Start.valueOf()) - (event1End.valueOf() - event1Start.valueOf()));
        }
      }
    }
    return event1Start.valueOf() - event2Start.valueOf();
  });
  const firstDayOfWeek: Date = new Date(dates[0].date);
  const lastDayOfWeek: Date = new Date(dates[dates.length - 1].date);
  lastDayOfWeek.setHours(23);
  lastDayOfWeek.setMinutes(59);
  for (let i = 0; i < events.length; i++) {
    const event: IDateEvent = events[i];
    const eventStartDate: Date = new Date(event.from);
    const eventEndDate: Date = new Date(event.to);
    const startPos: number = (eventStartDate <= firstDayOfWeek) ? 0 : eventStartDate.getDay();
    const endPos: number = (eventEndDate >= lastDayOfWeek) ? 6 : eventEndDate.getDay();
    let index = 0;
    for (let row = 0; row < eventsPos.length; row++) {
      if (eventsPos[row][startPos] === null) {
        index = row;
        break;
      }
    }
    eventsPos[index].splice(startPos, (endPos - startPos) + 1, ...new Array((endPos - startPos) + 1).fill(event.id));
    eventsRow.push(
      <div
        role="button"
        style={{
          gridColumn: `${startPos + 1} / ${endPos + 2}`,
          gridRow: index + 2,
        }}
        className={[
          styles.event,
          `${events[i].color}-background`,
        ].join(' ')}
        aria-hidden="true"
        data-event-id={events[i].id}
        onClick={handleGridClick}
      >
        {events[i].name}
      </div>,
    );
  }

  return (
    <div className={styles['week-row']}>
      {grid}
      {datesRow}
      {eventsRow}
    </div>
  );
};

const MonthView = (): JSX.Element => {
  const [showDisplayModal, setShowDisplayModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalEventId, setModalEventId] = useState(-1);
  const selectedDate = new Date(useSelector((state: RootState) => state.date.selectedDate));
  const daysInMonth: Array<Array<util.DayType>> = util.getMonthArray(selectedDate);

  const showEvent = (eventId: number) => {
    setModalEventId(eventId);
    setShowDisplayModal(true);
  };

  const week: Array<JSX.Element> = [];
  week.push(
    <div key="days_of_week-row" className={styles['days-of-week-row']}>
      <div className={styles['day-of-week']}>Sunday</div>
      <div className={styles['day-of-week']}>Monday</div>
      <div className={styles['day-of-week']}>Tuesday</div>
      <div className={styles['day-of-week']}>Wednesday</div>
      <div className={styles['day-of-week']}>Thursday</div>
      <div className={styles['day-of-week']}>Friday</div>
      <div className={styles['day-of-week']}>Saturday</div>
    </div>,
  );
  for (let i = 0; i < daysInMonth.length; i++) {
    week.push(
      <Week
        key={`week_${i}`}
        dates={daysInMonth[i]}
        last={i === daysInMonth.length - 1}
        selectedDate={selectedDate}
        showEvent={showEvent}
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
      <DisplayEventModal
        show={showDisplayModal}
        eventId={modalEventId}
        handleClose={() => setShowDisplayModal(false)}
        handleShowEditModal={() => setShowEditModal(true)}
      />
      <CreateEventModal show={showEditModal} eventIdToEdit={modalEventId} handleClose={() => setShowEditModal(false)} />
      {week}
    </div>
  );
};

export default MonthView;
