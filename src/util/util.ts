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

export type DayType = {
  // Previous month days: GRAY
  // Current month days: BLACK
  // Holidays in current month
  color: string,
  date: Date,
};

export const getMonthArray = (date: Date): Array<Array<DayType>> => {
  const month = date.getMonth();
  const year = date.getFullYear();
  const daysInMonth: number = getNumberOfDaysInMonth(month, year);
  const firstDayOfMonth: Date = new Date(year, month, 1);
  const dayOne: number = firstDayOfMonth.getDay();
  const dayArray: Array<Array<DayType>> = [[]];
  let index = 0;

  // Populating days before the 1st of the month with the last few days of the previous month
  const prevMonthAndYear = calculatePrevMonthAndYear(month, year);
  const daysInPrevMonth = getNumberOfDaysInMonth(prevMonthAndYear.month, prevMonthAndYear.year);
  for (let i = 0; i < dayOne; i++) {
    dayArray[index].push({
      color: 'gray',
      date: new Date(prevMonthAndYear.year, prevMonthAndYear.month, daysInPrevMonth - (dayOne - i - 1)),
    });
  }

  // Populating the days of the current month
  for (let i = 1; i <= daysInMonth; i++) {
    if (dayArray[index].length === 7) {
      dayArray.push([]);
      index += 1;
    }
    dayArray[index].push({
      color: 'black',
      date: new Date(year, month, i),
    });
  }

  // Populating the days after the end of the current month with the first few days
  // of the next month
  let count = 1;
  const nextMonthAndYear = calculateNextMonthAndYear(month, year);
  while (dayArray[index].length !== 7) {
    dayArray[index].push({
      color: 'gray',
      date: new Date(nextMonthAndYear.year, nextMonthAndYear.month, count),
    });
    count += 1;
  }
  return dayArray;
};

export const getWeekArray = (date: Date): Array<DayType> => {
  const daysInMonth: number = getNumberOfDaysInMonth(date.getMonth(), date.getFullYear());
  const dayOfWeek: number = date.getDay();
  const dayArray: Array<DayType> = [];
  let currDay = date.getDate() - dayOfWeek;

  // Populating days before the 1st of the month with the last few days of the previous month
  const prevMonthAndYear = calculatePrevMonthAndYear(date.getMonth(), date.getFullYear());
  const daysInPrevMonth = getNumberOfDaysInMonth(prevMonthAndYear.month, prevMonthAndYear.year);
  while (currDay <= 0) {
    dayArray.push({
      color: 'gray',
      date: new Date(prevMonthAndYear.year, prevMonthAndYear.month, daysInPrevMonth + currDay),
    });
    currDay += 1;
  }

  // Populating the days of the current month
  while (currDay <= daysInMonth && dayArray.length !== 7) {
    dayArray.push({
      color: 'black',
      date: new Date(date.getFullYear(), date.getMonth(), currDay),
    });
    currDay += 1;
  }

  // Populating the days after the end of the current month with the first few days
  // of the next month
  const nextMonthAndYear = calculateNextMonthAndYear(date.getMonth(), date.getFullYear());
  while (currDay >= daysInMonth && dayArray.length !== 7) {
    dayArray.push({
      color: 'gray',
      date: new Date(nextMonthAndYear.year, nextMonthAndYear.month, currDay - daysInMonth),
    });
    currDay += 1;
  }

  return dayArray;
};

export const getCurrentDate = (): Date => {
  return new Date();
};

type MonthYearObject = {
  month: number,
  year: number
};

export const isValidYear = (year: number): boolean => {
  if (Number.isNaN(year)) return false;
  if (year.toString().includes('.')) return false;
  if (year < 1970) return false;
  if (year > 275760) return false;
  return true;
};

export const isValidDay = (day: number, month: number, year: number): boolean => {
  if (Number.isNaN(day)) return false;
  if (day.toString().includes('.')) return false;
  if (!isValidYear(year)) return false;
  if (day < 0) return false;
  const numberOfDaysInMonth = getNumberOfDaysInMonth(month, year);
  if (day > numberOfDaysInMonth) return false;
  return true;
};

export const isValidHour = (hour: number): boolean => {
  if (Number.isNaN(hour)) return false;
  if (hour.toString().includes('.')) return false;
  if (hour < 0) return false;
  if (hour > 23) return false;
  return true;
};
