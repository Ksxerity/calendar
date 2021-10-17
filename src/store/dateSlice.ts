import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDateEvent, DateState } from './dateTypes';
import demoEvents from './demoEvents';

const initialState: DateState = {
  selectedDate: new Date().toString(),
  calendarView: 'month',
  events: demoEvents,
};

const dateSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    changeCalendarView: (state) => {
      if (state.calendarView === 'month') {
        state.calendarView = 'week';
      } else if (state.calendarView === 'week') {
        state.calendarView = 'day';
      } else {
        state.calendarView = 'month';
      }
    },
    selectNewDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    addDateEvent: (state, action: PayloadAction<IDateEvent>) => {
      if (state.events.length === 0) {
        action.payload.id = 0;
      } else {
        action.payload.id = state.events[state.events.length - 1].id + 1;
      }
      state.events.push(action.payload);
    },
    editDateEvent: (state, action: PayloadAction<IDateEvent>) => {
      const eventIndex = state.events.findIndex((event) => event.id === action.payload.id);
      state.events.splice(eventIndex, 1, action.payload);
    },
    removeDateEvent: (state, action: PayloadAction<number>) => {
      const index: number = state.events.findIndex((element) => element.id === action.payload);
      state.events.splice(index, 1);
    },
  },
});

export const {
  changeCalendarView,
  selectNewDate,
  addDateEvent,
  editDateEvent,
  removeDateEvent,
} = dateSlice.actions;

export default dateSlice.reducer;
