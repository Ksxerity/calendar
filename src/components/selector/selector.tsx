import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
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
  if (calendarView === 'day') {
    monthLabel = `${monthLabel} ${selectedDate.day}`;
    if (selectedDate.year !== new Date().getFullYear()) {
      monthLabel = `${monthLabel},`;
    }
  }
  if (selectedDate.year !== new Date().getFullYear()) {
    monthLabel = `${monthLabel} ${selectedDate.year}`;
  }
  return monthLabel;
};

type SelectionModalProps = {
  show: boolean,
  handleClose: () => void,
};

const SelectionModal = ({ show, handleClose }: SelectionModalProps): JSX.Element => {
  const [yearError, setYearError] = useState(false);
  const [yearValue, setYearValue] = useState(`${selectedDate.year}`);

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const yearVal = parseInt(yearValue, 10);
    if (!util.isValidYear(yearVal)) {
      setYearError(true);
    } else {
      setYearError(false);
      const newDate: ISelectedDate = { ...selectedDate };
      newDate.year = yearVal;
      newDate.month = parseInt(event.currentTarget.id, 10);
      dispatch(selectNewDate(newDate));
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} dialogClassName={styles['modal-dialog']}>
      <Modal.Header>
        <form noValidate={true} onSubmit={(e) => e.preventDefault()} autoComplete="off">
          <div className={['form-group', 'form-input'].join(' ')}>
            <input
              type="number"
              id="yearInput"
              name="year"
              className={['form-group', yearError ? ['input-error', styles['input-error']].join(' ') : null].join(' ')}
              placeholder="Year"
              onChange={(event) => setYearValue(event.currentTarget.value)}
              value={yearValue}
            />
            <label htmlFor="yearInput">Year</label>
          </div>
        </form>
      </Modal.Header>
      <Modal.Body className={styles['modal-body']}>
        <button type="button" id="0" className={styles.month} onClick={handleSubmit}>January</button>
        <button type="button" id="1" className={styles.month} onClick={handleSubmit}>February</button>
        <button type="button" id="2" className={styles.month} onClick={handleSubmit}>March</button>
        <button type="button" id="3" className={styles.month} onClick={handleSubmit}>April</button>
        <button type="button" id="4" className={styles.month} onClick={handleSubmit}>May</button>
        <button type="button" id="5" className={styles.month} onClick={handleSubmit}>June</button>
        <button type="button" id="6" className={styles.month} onClick={handleSubmit}>July</button>
        <button type="button" id="7" className={styles.month} onClick={handleSubmit}>August</button>
        <button type="button" id="8" className={styles.month} onClick={handleSubmit}>September</button>
        <button type="button" id="9" className={styles.month} onClick={handleSubmit}>October</button>
        <button type="button" id="10" className={styles.month} onClick={handleSubmit}>November</button>
        <button type="button" id="11" className={styles.month} onClick={handleSubmit}>December</button>
      </Modal.Body>
    </Modal>
  );
};

const Selector = (): JSX.Element => {
  const [show, setShow] = useState(false);
  selectedDate = useSelector((state: RootState) => state.date.selectedDate);
  calendarView = useSelector((state: RootState) => state.date.calendarView);
  dispatch = useDispatch<AppDispatch>();

  return (
    <div className={styles.selector}>
      <SelectionModal show={show} handleClose={() => setShow(false)} />
      <button id="prev" type="button" className={styles['arrow-button']} onClick={handleArrowClick}>
        <img src={LeftArrowIcon} alt="Left arrow button" className={styles['arrow-icon']} />
      </button>
      <button type="button" className={styles['select-month']} onClick={() => setShow(true)}>
        {populateMonthLabel()}
      </button>
      <button id="next" type="button" className={styles['arrow-button']} onClick={handleArrowClick}>
        <img src={RightArrowIcon} alt="Right arrow button" className={styles['arrow-icon']} />
      </button>
    </div>
  );
};

export default Selector;
