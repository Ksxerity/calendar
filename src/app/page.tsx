'use client'

import { JSX, useReducer } from 'react';
import {
  Actions,
  DayView,
  MonthView,
  Selector,
  WeekView,
} from '../components';
import { calendarReducer, initialCalendarState } from '@/store/calendarReducer';
import { CalendarContext, CalendarDispatchContext } from '@/store/calendarContext';
import { ThemeProvider } from "@material-tailwind/react";

const theme = {
  select: {
    styles: {
      base: {
        container: {
          minWidth: "min-w-[50px]"
        },
        menu: {
          maxHeight: "max-h-36"
        }
      }
    }
  }
}

export default function Home() {
  const [calendar, dispatch] = useReducer(
    calendarReducer,
    initialCalendarState
  );
  const calendarView: string = calendar.calendarView;
  let calendarType: JSX.Element;

  if (calendarView === 'month') {
    calendarType = <MonthView />;
  } else if (calendarView === 'week') {
    calendarType = <WeekView />;
  } else {
    calendarType = <DayView />;
  }

  return (
    <ThemeProvider value={theme}>
      <CalendarContext.Provider value={calendar}>
        <CalendarDispatchContext.Provider value={dispatch}>
          <div className='flex justify-center h-screen'>
            <div className="flex flex-col w-[85%]">
              <Actions />
              <Selector />
              <div className='border-2 border-groove border-[#BDC3C7] grow mb-[100px]'>
                {calendarType}
              </div>
            </div>
          </div>
        </CalendarDispatchContext.Provider>
    </CalendarContext.Provider>
  </ThemeProvider>
  );
}
