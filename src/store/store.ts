import { configureStore } from '@reduxjs/toolkit';
import dateReducer from './dateSlice';

export const store = configureStore({
  reducer: {
    date: dateReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
