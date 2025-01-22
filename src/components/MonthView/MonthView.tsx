import React, { useState } from 'react';
import { CreateEventModal, DisplayAllEventsModal, DisplayEventModal } from '../Modals';
import * as util from '../../util';
import { useNonNullContext } from '@/store/calendarContext';
import { IDateEvent } from '@/store/dateTypes';
import { Button, Typography } from '@material-tailwind/react';

type WeekProps = {
  dates: Array<util.DayType>,
  last: boolean,
  selectedDate: Date,
  showEvent: (eventId: number) => void,
  showAllEvents: () => void,
};

const Week = (props: WeekProps): JSX.Element => {
  const dispatch = useNonNullContext('dispatch');
  const {
    dates,
    last,
    selectedDate,
    showEvent,
    showAllEvents,
  } = props;

  const handleGridClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const date: string = (event.currentTarget.getAttribute('data-date') || '');
    if (!date) {
      const eventId: string = (event.currentTarget.getAttribute('data-event-id') || '');
      if (eventId) {
        showEvent(parseInt(eventId, 10));
      } else {
        const eventDate: string = (event.currentTarget.getAttribute('data-event-date') || '');
        const currentDate: Date = new Date(eventDate);
        currentDate.setHours(selectedDate.getHours());
        dispatch({ type: 'selectNewDate', payload: currentDate.toString() });
        showAllEvents();
      }
    } else {
      const currentDate: Date = new Date(date);
      currentDate.setHours(selectedDate.getHours());
      dispatch({ type: 'selectNewDate', payload: currentDate.toString() });
    }
  };

  const grid: Array<JSX.Element> = [];
  const datesRow: Array<JSX.Element> = [];
  const getLinearGradient = (index: number) => {
    if (last) {
      if (index !== 0) {
        return 'linear-gradient(lightgray, lightgray) left / 2px 80% no-repeat';
      }
    } else {
      if (index !== 0) {
        return 'linear-gradient(lightgray, lightgray) bottom / 80% 2px no-repeat, linear-gradient(lightgray, lightgray) left / 2px 80% no-repeat';
      } else {
        return 'linear-gradient(lightgray, lightgray) bottom / 80% 2px no-repeat';
      }
    }
    return 'none';
  }
  for (let i = 0; i < dates.length; i++) {
    // Handles the onClick event for selecting a new date and manages the grid border styles
    grid.push(
      <Button
        variant='text'
        ripple={false}
        key={`grid-${dates[i].date}-${i}`}
        style={{
          gridColumnStart: i + 1,
          background: getLinearGradient(i)
        }}
        className={`row-start-1 row-end-9 rounded-lg border-none overflow-hidden ${(dates[i].date.getDate() === selectedDate.getDate() && dates[i].color === 'black') ? '!bg-[lightsteelblue]' : 'hover:!bg-[#e3e3e3]'}`}
        data-color={dates[i].color}
        data-date={dates[i].date}
        onClick={handleGridClick}
      > </Button>,
    );
    // Occupies the first row of each date box grid. Displays the day of the month
    datesRow.push(
      <Button
        variant="text"
        size="sm"
        ripple={false}
        key={`datesrow-${dates[i].date}-${i}`}
        data-color={dates[i].color}
        data-date={dates[i].date}
        style={{
          color: dates[i].color,
          gridColumnStart: i + 1,
        }}
        className='row-start-1 pl-2 text-sm md:text-base lg:text-lg text-left !leading-none hover:bg-transparent active:bg-transparent'
        onClick={handleGridClick}
      >
        {(new Date(dates[i].date)).getDate()}
      </Button>,
    );
  }

  const eventsRow: Array<JSX.Element> = [];
  const eventsPos: Array<Array<number | null>> = new Array(7).fill(null).map(() => new Array(7).fill(null));
  const events: Array<IDateEvent> = util.getCurrentWeekEvents(dates, selectedDate);
  events.sort(util.eventSorting);
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
    let index = -1;
    for (let row = 0; row < eventsPos.length; row++) {
      if (eventsPos[row][startPos] === null) {
        index = row;
        break;
      }
    }
    if (index === 6) {
      // Too many events in one day. Add a '...' to the bottom row
      eventsPos[index].splice(startPos, (endPos - startPos) + 1, ...new Array((endPos - startPos) + 1).fill(event.id));
      eventsRow.push(
        <Button
          size="sm"
          ripple={false}
          key={`eventsrow-${events[i].id}-${dates[0].date}`}
          style={{
            gridColumn: `${startPos + 1} / ${endPos + 2}`,
            gridRow: index + 2,
          }}
          className='ml-px p-0 rounded bg-[lightgray] hover:shadow-none shadow-none'
          data-event-date={events[i].from}
          onClick={handleGridClick}
        >
          <Typography variant="h6" className='text-left text-black leading-[.5rem] ml-1'>
            ...
          </Typography>
        </Button>,
      );
    } else if (index !== -1) {
      // There is enough space in the row to put another event
      eventsPos[index].splice(startPos, (endPos - startPos) + 1, ...new Array((endPos - startPos) + 1).fill(event.id));
      let eventName: string = events[i].name;
      if (startPos === endPos) {
        const date: Date = new Date(events[i].from);
        eventName = `${date.getHours()}:${date.getMinutes()}${date.getMinutes() === 0 ? 0 : ''} - ${events[i].name}`;
      }
      eventsRow.push(
        <Button
          size="sm"
          ripple={false}
          key={`eventsrow-${events[i].id}-${dates[0].date}`}
          style={{
            gridColumn: `${startPos + 1} / ${endPos + 2}`,
            gridRow: index + 2,
          }}
          className={`ml-px pl-1 rounded pr-1 overflow-hidden whitespace-nowrap text-ellipsis text-black text-left normal-case text-xs md:text-sm lg:text-base !leading-[0px] font-light bg-custom-${events[i].color} hover:bg-custom-${events[i].color} hover:shadow-none shadow-none`}
          data-event-id={events[i].id}
          onClick={handleGridClick}
        >
          {eventName}
        </Button>,
      );
    }
  }

  return (
    <div className='grid grid-cols-7 grid-rows-[15%_repeat(7,_minmax(0,_1fr))] gap-y-px'>
      {grid}
      {datesRow}
      {eventsRow}
    </div>
  );
};

const MonthView = (): JSX.Element => {
  const calendar = useNonNullContext('state');
  const [showDisplayModal, setShowDisplayModal] = useState(false);
  const [showDisplayAllModal, setShowDisplayAllModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalEventId, setModalEventId] = useState(-1);
  const selectedDate = new Date(calendar.selectedDate);
  const daysInMonth: Array<Array<util.DayType>> = util.getMonthArray(selectedDate);

  const showEvent = (eventId: number) => {
    setModalEventId(eventId);
    setShowDisplayModal(true);
  };

  const showAllEvents = () => {
    setShowDisplayAllModal(true);
  };

  const week: Array<JSX.Element> = [];
  week.push(
    <div key="days_of_week-row" className='flex flow-row text-center items-center'>
      <div className='grow text-base md:text-lg lg:text-xl'>Sunday</div>
      <div className='grow text-base md:text-lg lg:text-xl'>Monday</div>
      <div className='grow text-base md:text-lg lg:text-xl'>Tuesday</div>
      <div className='grow text-base md:text-lg lg:text-xl'>Wednesday</div>
      <div className='grow text-base md:text-lg lg:text-xl'>Thursday</div>
      <div className='grow text-base md:text-lg lg:text-xl'>Friday</div>
      <div className='grow text-base md:text-lg lg:text-xl'>Saturday</div>
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
        showAllEvents={showAllEvents}
      />,
    );
  }

  let monthView: string;
  if (daysInMonth.length === 4) {
    monthView = 'grid h-full grid-cols-[100%] grid-rows-[3%_repeat(4,_minmax(0,_1fr))]';
  } else if (daysInMonth.length === 5) {
    monthView = 'grid h-full grid-cols-[100%] grid-rows-[3%_repeat(5,_minmax(0,_1fr))]';
  } else {
    monthView = 'grid h-full grid-cols-[100%] grid-rows-[3%_repeat(6,_minmax(0,_1fr))]';
  }

  let modal = null;
  if (showEditModal) {
    modal = <CreateEventModal show={showEditModal} eventIdToEdit={modalEventId} handleClose={() => setShowEditModal(false)} />;
  } else if (showDisplayModal) {
    modal = (
      <DisplayEventModal
        show={showDisplayModal}
        eventId={modalEventId}
        handleClose={() => setShowDisplayModal(false)}
        handleShowEditModal={() => setShowEditModal(true)}
      />
    );
  } else if (showDisplayAllModal) {
    modal = (
      <DisplayAllEventsModal
        selectedDateString={selectedDate.toString()}
        show={showDisplayAllModal}
        handleClose={() => setShowDisplayAllModal(false)}
        handleShowDisplayModal={(id: number) => showEvent(id)}
      />
    );
  } else {
    modal = null;
  }

  return (
    <div className={`${monthView}`}>
      {modal}
      {week}
    </div>
  );
};

export default MonthView;
