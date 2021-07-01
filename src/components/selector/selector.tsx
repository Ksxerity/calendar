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
let dispatch: AppDispatch;

const handleMonthClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  // Create modal here
};

const handleArrowClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  const newDate = { ...selectedDate };
  if (event.currentTarget.id === 'prev') {
    if (newDate.month === 0) {
      newDate.month = 11;
      newDate.year -= 1;
    } else {
      newDate.month -= 1;
    }
  } else if (newDate.month === 11) {
    newDate.month = 0;
    newDate.year += 1;
  } else {
    newDate.month += 1;
  }
  const numberOfDaysInNewMonth = util.getNumberOfDaysInMonth(newDate.month, newDate.year);
  newDate.day = newDate.day > numberOfDaysInNewMonth ? numberOfDaysInNewMonth : newDate.day;
  dispatch(selectNewDate(newDate));
};

const populateMonthLabel = (): string => {
  const currentDate = new Date(selectedDate.year, selectedDate.month, selectedDate.day);
  let monthLabel = currentDate.toLocaleString('default', { month: 'long' });
  if (selectedDate.year !== new Date().getFullYear()) {
    monthLabel = `${monthLabel} ${selectedDate.year}`;
  }
  return monthLabel;
};

const Selector = (): JSX.Element => {
  selectedDate = useSelector((state: RootState) => state.date.selectedDate);
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
