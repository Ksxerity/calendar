import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDateEvent, ISelectedDate, DateState } from './dateTypes';
import * as util from '../util';

const initialState: DateState = {
  selectedDate: util.getCurrentDate(),
  calendarView: 'month',
  events: [],
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
    selectNewDate: (state, action: PayloadAction<ISelectedDate>) => {
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
  removeDateEvent,
} = dateSlice.actions;

export default dateSlice.reducer;
