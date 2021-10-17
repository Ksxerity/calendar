import { createSelector, OutputSelector } from 'reselect';
import { DateState, IDateEvent } from '../store/dateTypes';
import { RootState } from '../store/store';
import { DayType } from './util';

type EventsSelector = OutputSelector<{ date: DateState; }, IDateEvent[], (res: IDateEvent[]) => IDateEvent[]>;
type EventSelector = OutputSelector<{ date: DateState; }, IDateEvent | undefined, (res: IDateEvent[]) => IDateEvent | undefined>;
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
export const currentWeekEventSelector = (dates: Array<DayType>, selectedDate: Date): EventsSelector => {
  const selector = createSelector(
    (state: RootState) => state.date.events,
    (events: IDateEvent[]) => events.filter((event: IDateEvent) => {
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
    }),
  );
  return selector;
};

/**
 * date: an ISelectedDate object representing the date to sort by
 */
export const dayEventSelector = (date: Date): EventsSelector => {
  const selector = createSelector(
    (state: RootState) => state.date.events,
    (events: IDateEvent[]) => events.filter((event: IDateEvent) => {
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
    }),
  );
  return selector;
};

export const eventIdSelector = (eventId: number): EventSelector => {
  const selector = createSelector(
    (state: RootState) => state.date.events,
    (events: IDateEvent[]) => events.find((event: IDateEvent) => event.id === eventId),
  );
  return selector;
};
