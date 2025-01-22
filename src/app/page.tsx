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
            <div className="flex flex-col items-center w-4/5">
              <Actions />
              <div style={{ borderStyle: 'groove' }} className='border-b-2 border-[#BDC3C7] w-[90%]' />
              <div className='w-4/5'>
                <Selector />
              </div>
              <div style={{ borderStyle: 'groove' }} className='border-2 border-[#BDC3C7] h-4/5 w-4/5'>
                {calendarType}
              </div>
            </div>
          </div>
        </CalendarDispatchContext.Provider>
    </CalendarContext.Provider>
  </ThemeProvider>
  );
}
