import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { selectNewDate } from '../../store/dateSlice';
import { ISelectedDate } from '../../store/dateTypes';
import * as util from '../../util';
import styles from './selector.module.scss';
import {
  LeftArrowIcon,
  RightArrowIcon,
} from '../../assets';

let selectedDate: ISelectedDate;
let calendarView: string;
let dispatch: AppDispatch;

const handleMonthClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  // Create modal here
};

const handleArrowClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  const newDate: ISelectedDate = { ...selectedDate };
  if (calendarView === 'month') {
    if (event.currentTarget.id === 'prev') {
      const { month, year } = util.calculatePrevMonthAndYear(newDate.month, newDate.year);
      newDate.month = month;
      newDate.year = year;
    } else if (event.currentTarget.id === 'next') {
      const { month, year } = util.calculateNextMonthAndYear(newDate.month, newDate.year);
      newDate.month = month;
      newDate.year = year;
    }
    const numberOfDaysInNewMonth: number = util.getNumberOfDaysInMonth(newDate.month, newDate.year);
    newDate.day = newDate.day > numberOfDaysInNewMonth ? numberOfDaysInNewMonth : newDate.day;
  } else if (calendarView === 'week') {
    if (event.currentTarget.id === 'prev') {
      if (newDate.day - 7 < 1) {
        const { month, year } = util.calculatePrevMonthAndYear(newDate.month, newDate.year);
        newDate.month = month;
        newDate.year = year;
        newDate.day -= 7;
        newDate.day += util.getNumberOfDaysInMonth(month, year);
      } else {
        newDate.day -= 7;
      }
    } else if (event.currentTarget.id === 'next') {
      const currDaysInMonth: number = util.getNumberOfDaysInMonth(newDate.month, newDate.year);
      if (newDate.day + 7 > currDaysInMonth) {
        const { month, year } = util.calculateNextMonthAndYear(newDate.month, newDate.year);
        newDate.month = month;
        newDate.year = year;
        newDate.day += 7;
        newDate.day -= currDaysInMonth;
      } else {
        newDate.day += 7;
      }
    }
  } else if (calendarView === 'day') {
    if (event.currentTarget.id === 'prev') {
      if (newDate.day === 1) {
        const { month, year } = util.calculatePrevMonthAndYear(newDate.month, newDate.year);
        newDate.month = month;
        newDate.year = year;
        newDate.day = util.getNumberOfDaysInMonth(month, year);
      } else {
        newDate.day -= 1;
      }
    } else if (event.currentTarget.id === 'next') {
      if (newDate.day === util.getNumberOfDaysInMonth(newDate.month, newDate.year)) {
        newDate.day = 1;
        const { month, year } = util.calculateNextMonthAndYear(newDate.month, newDate.year);
        newDate.month = month;
        newDate.year = year;
      } else {
        newDate.day += 1;
      }
    }
  }
  dispatch(selectNewDate(newDate));
};

const populateMonthLabel = (): string => {
  const currentDate: Date = new Date(selectedDate.year, selectedDate.month, selectedDate.day);
  let monthLabel: string = currentDate.toLocaleString('default', { month: 'long' });
  if (selectedDate.year !== new Date().getFullYear()) {
    monthLabel = `${monthLabel} ${selectedDate.year}`;
  }
  return monthLabel;
};

const Selector = (): JSX.Element => {
  selectedDate = useSelector((state: RootState) => state.date.selectedDate);
  calendarView = useSelector((state: RootState) => state.date.calendarView);
  dispatch = useDispatch<AppDispatch>();

  return (
    <div className={styles.selector}>
      <button id="prev" type="button" className={styles['arrow-button']} onClick={handleArrowClick}>
        <img src={LeftArrowIcon} alt="Left arrow button" className={styles['arrow-icon']} />
      </button>
      <button type="button" className={styles['select-month']} onClick={handleMonthClick}>
        {populateMonthLabel()}
      </button>
      <button id="next" type="button" className={styles['arrow-button']} onClick={handleArrowClick}>
        <img src={RightArrowIcon} alt="Right arrow button" className={styles['arrow-icon']} />
      </button>
    </div>
  );
};

export default Selector;
