function leapYear(year: number): number {
  if (year % 4 === 0) {
    return 29;
  }
  return 28;
}

function getNumberOfDaysInMonth(month: number, year: number): number {
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

export const getMonthArray = (month: number, year: number): Array<Array<number>> => {
  const daysInMonth = getNumberOfDaysInMonth(month, year);
  const firstDayOfMonth = new Date(year, month, 1);
  const dayOne = firstDayOfMonth.getDay();
  const dayArray: Array<Array<number>> = [[]];
  let index = 0;
  for (let i = 0; i < dayOne; i++) {
    dayArray[index].push(0);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    if (dayArray[index].length === 7) {
      dayArray.push([]);
      index += 1;
    }
    dayArray[index].push(i);
  }
  while (dayArray[index].length !== 7) {
    dayArray[index].push(0);
  }
  return dayArray;
};
