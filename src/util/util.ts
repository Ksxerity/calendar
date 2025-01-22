function leapYear(year: number): number {
  if (year % 4 === 0) {
    return 29;
  }
  return 28;
}

export function getNumberOfDaysInMonth(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth();
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
  date: Date,
};

export const getMonthArray = (date: Date): Array<Array<DayType>> => {
  const month = date.getMonth();
  const year = date.getFullYear();
  const daysInMonth: number = getNumberOfDaysInMonth(date);
  const firstDayOfMonth: Date = new Date(year, month, 1);
  const dayOne: number = firstDayOfMonth.getDay();
  const dayArray: Array<Array<DayType>> = [[]];
  let index = 0;

  // Populating days before the 1st of the month with the last few days of the previous month
  const prevMonth = new Date(date.toString());
  prevMonth.setDate(0);
  const daysInPrevMonth = getNumberOfDaysInMonth(prevMonth);
  for (let i = 0; i < dayOne; i++) {
    dayArray[index].push({
      color: 'gray',
      date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), daysInPrevMonth - (dayOne - i - 1)),
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
  const nextMonth = new Date(date.toString());
  nextMonth.setDate(1);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  while (dayArray[index].length !== 7) {
    dayArray[index].push({
      color: 'gray',
      date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), count),
    });
    count += 1;
  }
  return dayArray;
};

export const getWeekArray = (date: Date): Array<DayType> => {
  const daysInMonth: number = getNumberOfDaysInMonth(date);
  const dayOfWeek: number = date.getDay();
  const dayArray: Array<DayType> = [];
  let currDay = date.getDate() - dayOfWeek;

  // Populating days before the 1st of the month with the last few days of the previous month
  const prevMonth = new Date(date.toString());
  prevMonth.setDate(0);
  const daysInPrevMonth = getNumberOfDaysInMonth(prevMonth);
  while (currDay <= 0) {
    dayArray.push({
      color: 'gray',
      date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), daysInPrevMonth + currDay),
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
  const nextMonth = new Date(date.toString());
  nextMonth.setDate(1);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  while (currDay >= daysInMonth && dayArray.length !== 7) {
    dayArray.push({
      color: 'gray',
      date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), currDay - daysInMonth),
    });
    currDay += 1;
  }

  return dayArray;
};

export const getCurrentDate = (): Date => {
  return new Date();
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
  const currentMonth = new Date(year, month, 1);
  const numberOfDaysInMonth = getNumberOfDaysInMonth(currentMonth);
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

export const hourTostring = (hour: string | number): string => {
  const hourNumber = Number.parseInt(`${hour}`, 10);
  if (hourNumber === 0) {
    return '00';
  } else if ( hourNumber < 10) {
    return `0${hour}`;
  }
  return `${hour}`;
}