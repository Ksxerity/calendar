import { ISelectedDate } from '../store/dateTypes';

function leapYear(year: number): number {
  if (year % 4 === 0) {
    return 29;
  }
  return 28;
}

export function getNumberOfDaysInMonth(month: number, year: number): number {
  let days = 0;
  switch (month) {
    case 0:
    case 2:
    case 4:
    case 6:
    case 7:
    case 9:
    case 11:
      days = 31;
      break;
    case 3:
    case 5:
    case 8:
    case 10:
      days = 30;
      break;
    default:
      days = leapYear(year);
      break;
  }
  return days;
}

export type DayType = {
  // Previous month days: GRAY
  // Current month days: BLACK
  // Holidays in current month
  color: string,
  day: number,
};

export const getMonthArray = (month: number, year: number): Array<Array<DayType>> => {
  const daysInMonth: number = getNumberOfDaysInMonth(month, year);
  const firstDayOfMonth: Date = new Date(year, month, 1);
  const dayOne: number = firstDayOfMonth.getDay();
  const dayArray: Array<Array<DayType>> = [[]];
  let index = 0;

  // Populating days before the 1st of the month with the last few days of the previous month
  let daysInPrevMonth: number;
  if (month === 0) {
    daysInPrevMonth = getNumberOfDaysInMonth(11, year - 1);
  } else {
    daysInPrevMonth = getNumberOfDaysInMonth(month - 1, year);
  }
  for (let i = 0; i < dayOne; i++) {
    dayArray[index].push({ color: 'gray', day: daysInPrevMonth - (dayOne - i - 1) });
  }

  // Populating the days of the current month
  for (let i = 1; i <= daysInMonth; i++) {
    if (dayArray[index].length === 7) {
      dayArray.push([]);
      index += 1;
    }
    dayArray[index].push({ color: 'black', day: i });
  }

  // Populating the days after the end of the current month with the first few days
  // of the next month
  let count = 1;
  while (dayArray[index].length !== 7) {
    dayArray[index].push({ color: 'gray', day: count });
    count += 1;
  }
  return dayArray;
};

export const getWeekArray = (day: number, month: number, year: number): Array<DayType> => {
  const daysInMonth: number = getNumberOfDaysInMonth(month, year);
  const dayOfMonth: Date = new Date(year, month, day);
  const dayOfWeek: number = dayOfMonth.getDay();
  const dayArray: Array<DayType> = [];
  let currDay = day - dayOfWeek;

  // Populating days before the 1st of the month with the last few days of the previous month
  let daysInPrevMonth: number;
  if (month === 0) {
    daysInPrevMonth = getNumberOfDaysInMonth(11, year - 1);
  } else {
    daysInPrevMonth = getNumberOfDaysInMonth(month - 1, year);
  }
  while (currDay <= 0) {
    dayArray.push({ color: 'gray', day: daysInPrevMonth + currDay });
    currDay += 1;
  }

  // Populating the days of the current month
  while (currDay <= daysInMonth && dayArray.length !== 7) {
    dayArray.push({ color: 'black', day: currDay });
    currDay += 1;
  }

  // Populating the days after the end of the current month with the first few days
  // of the next month
  while (currDay >= daysInMonth && dayArray.length !== 7) {
    dayArray.push({ color: 'gray', day: currDay - daysInMonth });
    currDay += 1;
  }

  return dayArray;
};

export const getCurrentDate = (): ISelectedDate => {
  const dateObject: ISelectedDate = {
    month: new Date().getMonth(),
    day: new Date().getDate(),
    year: new Date().getFullYear(),
  };
  return dateObject;
};

type MonthYearObject = {
  month: number,
  year: number
};

export const calculatePrevMonthAndYear = (month: number, year: number): MonthYearObject => {
  const obj = { month, year };
  if (month === 0) {
    obj.month = 11;
    obj.year -= 1;
  } else {
    obj.month -= 1;
  }
  return obj;
};

export const calculateNextMonthAndYear = (month: number, year: number): MonthYearObject => {
  const obj = { month, year };
  if (month === 11) {
    obj.month = 0;
    obj.year += 1;
  } else {
    obj.month += 1;
  }
  return obj;
};