import { IDateEvent } from '../store/dateTypes';
import { DayType } from './util';
import { useNonNullContext } from '@/store/calendarContext';

// export const currentMonthEventSelector = (selectedDate: ISelectedDate): EventsSelector => {
//   const daysInMonth: Array<Array<DayType>> = getMonthArray(selectedDate.month, selectedDate.year);
//   const selector = createSelector(
//     (state: RootState) => state.date.events,
//     (events: IDateEvent[]) => events.filter((event: IDateEvent) => {
//       if (event.from.month === selectedDate.month) {
//         return true;
//       }
//       if (event.from.month === calculatePrevMonthAndYear(selectedDate.month, selectedDate.year).month) {
//         // Last few days of prev month
//         if (daysInMonth[0][0].color === 'gray' && event.to.date.getDate() >= daysInMonth[0][0].date.getDate()) return true;
//       }
//       if (event.from.month === calculateNextMonthAndYear(selectedDate.month, selectedDate.year).month) {
//         // First few days of next month
//         if (daysInMonth[daysInMonth.length - 1][6].color === 'gray'
//           && event.from.month <= daysInMonth[daysInMonth.length - 1][6].date.getDate()) return true;
//       }
//       return false;
//     }),
//   );
//   return selector;
// };

/**
 * dates: an array of the days of the week. i.e. [3, 4, 5, 6, 7, 8, 9]
 * selectedDate: an ISelectedDate object representing the currently selected date
 */
export const getCurrentWeekEvents = (dates: Array<DayType>, selectedDate: Date) => {
  const calendar = useNonNullContext('state');
  const filteredEvents = calendar.events.filter((event: IDateEvent) => {
    let startDate: Date;
    let endDate: Date;
    // Only compare year/month/day for filtering
    const eventStartDate = new Date(event.from);
    eventStartDate.setHours(0);
    eventStartDate.setMinutes(0);
    const eventEndDate = new Date(event.to);
    eventEndDate.setHours(0);
    eventEndDate.setMinutes(0);
    if (dates[0].color === 'gray') {
      // Week contains days from previous month
      startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, dates[0].date.getDate());
      endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), dates[6].date.getDate(), 23, 59);
    } else if (dates[6].color === 'gray') {
      // Week contains days from next month
      startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), dates[0].date.getDate());
      endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, dates[6].date.getDate(), 23, 59);
    } else {
      startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), dates[0].date.getDate());
      endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), dates[6].date.getDate(), 23, 59);
    }
    if (startDate <= eventStartDate && eventStartDate <= endDate) {
      // Event starts this week
      return true;
    }
    if (startDate <= eventEndDate && eventEndDate <= endDate) {
      // Event ends this week
      return true;
    }
    if (eventStartDate < startDate && endDate < eventEndDate) {
      // Event duration includes this week
      return true;
    }
    return false;
  })
  return filteredEvents;
};

/**
 * date: an ISelectedDate object representing the date to sort by
 */
export const getEventByDate = (date: Date) => {
  const calendar = useNonNullContext('state');
  const filteredEvents = calendar.events.filter((event: IDateEvent) => {
    // Only compare year/month/day for filtering
    const eventStartDate = new Date(event.from);
    eventStartDate.setHours(0);
    eventStartDate.setMinutes(0);
    const eventEndDate = new Date(event.to);
    eventEndDate.setHours(0);
    eventEndDate.setMinutes(0);
    const currentDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (currentDay.getTime() === eventStartDate.getTime()) {
      // Event starts this day
      return true;
    }
    if (currentDay.getTime() === eventEndDate.getTime()) {
      // Event ends this day
      return true;
    }
    if (eventStartDate < currentDay && currentDay < eventEndDate) {
      // Event duration includes this day
      return true;
    }
    return false;
  })
  return filteredEvents;
};

export const getEventById = (eventId: number) => {
  const calendar = useNonNullContext('state');
  return calendar.events.find((event: IDateEvent) => event.id === eventId)
};

export const eventSorting = (event1: IDateEvent, event2: IDateEvent): number => {
  // Sort by start time. Multi-day events are prioritized.
  const event1Start = new Date(event1.from);
  const event2Start = new Date(event2.from);
  const event1End = new Date(event1.to);
  const event2End = new Date(event2.to);
  if (event1Start.getFullYear() === event1End.getFullYear()
    && event1Start.getMonth() === event1End.getMonth()
    && event1Start.getDate() === event1End.getDate()) {
    if (event2Start.getFullYear() === event2End.getFullYear()
      && event2Start.getMonth() === event2End.getMonth()
      && event2Start.getDate() === event2End.getDate()) {
      // If both events start and end on the same day respectively, sort by start time
      return event1Start.valueOf() - event2Start.valueOf();
    }
    // Event 1 starts on the same day, so put it after (multi-day) event 2
    return 1;
  }
  if (event2Start.getFullYear() === event2End.getFullYear()
    && event2Start.getMonth() === event2End.getMonth()
    && event2Start.getDate() === event2End.getDate()) {
    // Event 2 starts on the same day, so put it after (multi-day) event 1
    return -1;
  }
  // else sort by duration
  return ((event2End.valueOf() - event2Start.valueOf()) - (event1End.valueOf() - event1Start.valueOf()));
};
