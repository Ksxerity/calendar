import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { selectNewDate } from '../../store/dateSlice';
import * as util from '../../util';
import styles from './Selector.module.scss';
import {
  LeftArrowIcon,
  RightArrowIcon,
} from '../../assets';

type SelectionModalProps = {
  show: boolean,
  handleClose: () => void,
};

const SelectionModal = ({ show, handleClose }: SelectionModalProps): JSX.Element => {
  const selectedDate = new Date(useSelector((state: RootState) => state.date.selectedDate));
  const dispatch = useDispatch<AppDispatch>();
  const [yearError, setYearError] = useState(false);
  const [yearValue, setYearValue] = useState(`${selectedDate.getFullYear()}`);

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const yearVal = parseInt(yearValue, 10);
    if (!util.isValidYear(yearVal)) {
      setYearError(true);
    } else {
      setYearError(false);
      const month = parseInt(event.currentTarget.id, 10);
      const daysInMonth = util.getNumberOfDaysInMonth((new Date(yearVal, month, 1)));
      const day = selectedDate.getDate() > daysInMonth ? daysInMonth : selectedDate.getDate();
      const newDate = new Date(yearVal, month, day, selectedDate.getHours());
      dispatch(selectNewDate(newDate.toString()));
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
  const selectedDate = new Date(useSelector((state: RootState) => state.date.selectedDate));
  const calendarView = useSelector((state: RootState) => state.date.calendarView);
  const dispatch = useDispatch<AppDispatch>();

  const populateMonthLabel = (): string => {
    let monthLabel: string = selectedDate.toLocaleString('default', { month: 'long' });
    if (calendarView === 'day') {
      monthLabel = `${monthLabel} ${selectedDate.getDate()}`;
      if (selectedDate.getFullYear() !== new Date().getFullYear()) {
        monthLabel = `${monthLabel},`;
      }
    }
    if (selectedDate.getFullYear() !== new Date().getFullYear()) {
      monthLabel = `${monthLabel} ${selectedDate.getFullYear()}`;
    }
    return monthLabel;
  };

  const handleArrowClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const currentDate = new Date(selectedDate.toString());
    currentDate.setMinutes(0);
    if (calendarView === 'month') {
      const numberOfDaysInNewMonth: number = util.getNumberOfDaysInMonth(currentDate);
      currentDate.setDate(currentDate.getDate() > numberOfDaysInNewMonth ? numberOfDaysInNewMonth : currentDate.getDate());
      if (event.currentTarget.id === 'prev') {
        currentDate.setMonth(currentDate.getMonth() - 1);
      } else if (event.currentTarget.id === 'next') {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    } else if (calendarView === 'week') {
      if (event.currentTarget.id === 'prev') {
        currentDate.setDate(currentDate.getDate() - 7);
      } else if (event.currentTarget.id === 'next') {
        currentDate.setDate(currentDate.getDate() + 7);
      }
    } else if (calendarView === 'day') {
      if (event.currentTarget.id === 'prev') {
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (event.currentTarget.id === 'next') {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    dispatch(selectNewDate(currentDate.toString()));
  };

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
