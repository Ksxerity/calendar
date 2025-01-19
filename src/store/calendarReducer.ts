import { DateState, ActionTypes } from './dateTypes';
import demoEvents from './demoEvents';

export const initialCalendarState: DateState = {
  selectedDate: new Date().toString(),
  calendarView: 'month',
  events: demoEvents,
};

export function calendarReducer(state: DateState, action: ActionTypes) {
  const newState = {...state};
  switch (action.type) {
    case 'changeCalendarView': {
      if (newState.calendarView === 'month') {
        newState.calendarView = 'week';
      } else if (newState.calendarView === 'week') {
        newState.calendarView = 'day';
      } else {
        newState.calendarView = 'month';
      }
      return newState;
    }
    case 'selectNewDate': {
      newState.selectedDate = action.payload;
      return newState;
    }
    case 'addDateEvent': {
      if (newState.events.length === 0) {
        newState.events = [...newState.events, {...action.payload, id: 0}];
      } else {
        newState.events = [...newState.events, {...action.payload, id: newState.events[newState.events.length - 1].id + 1}];
      }
      return newState;
    }
    case 'editDateEvent': {
      newState.events = newState.events.map((event) => event.id === action.payload.id ? action.payload : event);
      return newState;
    }
    case 'removeDateEvent': {
      const index: number = newState.events.findIndex((element) => element.id === action.payload);
      newState.events = [...newState.events];
      newState.events.splice(index, 1);
      return newState;
    }
    default: {
      throw Error('Unknown action');
    }
  }
}
