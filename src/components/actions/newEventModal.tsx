import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { changeCalendarView, selectNewDate } from '../../store/dateSlice';
import { ISelectedDate } from '../../store/dateTypes';
import * as util from '../../util';
import styles from './actions.module.scss';

type DurationErrors = {
  minute: boolean,
  hour: boolean,
  day: boolean,
  month: boolean,
  year: boolean,
};

type DurationValues = {
  minute: number,
  hour: number,
  day: number,
  month: number,
  year: number,
};

type DurationSectionProps = {
  type: string,
  values: DurationValues,
  errors: DurationErrors,
  setValue: ((value: DurationValues) => void),
};

const DurationSection = (props: DurationSectionProps): JSX.Element => {
  const {
    type,
    values,
    errors,
    setValue,
  } = props;
  return (
    <div className={styles['duration-section']}>
      <div className={styles['duration-type']}>
        {type}
      </div>
      <div className={['form-group', 'form-input'].join(' ')}>
        <input
          type="number"
          name="minute"
          className={[
            'form-group',
            errors.minute ? ['input-error', styles['input-error']].join(' ') : null].join(' ')}
          placeholder="Minute"
          onChange={(event) => setValue({
            ...values,
            minute: parseInt(event.currentTarget.value, 10),
          })}
          value={values.minute}
        />
        <label htmlFor="minute">Minute</label>
      </div>
      <div className={['form-group', 'form-input'].join(' ')}>
        <input
          type="number"
          name="hour"
          className={[
            'form-group',
            errors.hour ? ['input-error', styles['input-error']].join(' ') : null].join(' ')}
          placeholder="Hour"
          onChange={(event) => setValue({
            ...values,
            hour: parseInt(event.currentTarget.value, 10),
          })}
          value={values.hour}
        />
        <label htmlFor="hour">Hour</label>
      </div>
      <div className={['form-group', 'form-input'].join(' ')}>
        <input
          type="number"
          name="day"
          className={[
            'form-group',
            errors.day ? ['input-error', styles['input-error']].join(' ') : null].join(' ')}
          placeholder="Day"
          onChange={(event) => setValue({
            ...values,
            day: parseInt(event.currentTarget.value, 10),
          })}
          value={values.day}
        />
        <label htmlFor="day">Day</label>
      </div>
      <div className={['form-group', 'form-input'].join(' ')}>
        <input
          type="number"
          name="month"
          className={[
            'form-group',
            errors.hour ? ['input-error', styles['input-error']].join(' ') : null].join(' ')}
          placeholder="Month"
          onChange={(event) => setValue({
            ...values,
            month: parseInt(event.currentTarget.value, 10),
          })}
          value={values.month}
        />
        <label htmlFor="month">Month</label>
      </div>
      <div className={['form-group', 'form-input'].join(' ')}>
        <input
          type="number"
          name="year"
          className={[
            'form-group',
            errors.hour ? ['input-error', styles['input-error']].join(' ') : null].join(' ')}
          placeholder="Year"
          onChange={(event) => setValue({
            ...values,
            year: parseInt(event.currentTarget.value, 10),
          })}
          value={values.year}
        />
        <label htmlFor="year">Year</label>
      </div>
    </div>
  );
};

type NewEventModalProps = {
  show: boolean,
  handleClose: () => void,
};

const NewEventModal = ({ show, handleClose }: NewEventModalProps): JSX.Element => {
  const selectedDate = useSelector((state: RootState) => state.date.selectedDate);
  const dispatch = useDispatch<AppDispatch>();
  // Error State
  const [nameError, setNameError] = useState(false);
  const [fromDurationError, setFromDurationError] = useState({
    minute: false,
    hour: false,
    day: false,
    month: false,
    year: false,
  });
  const [toDurationError, setToDurationError] = useState({
    minute: false,
    hour: false,
    day: false,
    month: false,
    year: false,
  });
  // Value State
  const [nameValue, setNameValue] = useState('');
  const [fromDurationValue, setFromDurationValue] = useState({
    minute: 0,
    hour: selectedDate.hour,
    day: selectedDate.day,
    month: selectedDate.month,
    year: selectedDate.year,
  });
  const [toDurationValue, setToDurationValue] = useState({
    minute: 0,
    hour: selectedDate.hour,
    day: selectedDate.day,
    month: selectedDate.month,
    year: selectedDate.year,
  });

  return (
    <Modal show={show} onHide={handleClose} dialogClassName={styles['modal-dialog']}>
      <Modal.Header>
        New Event
      </Modal.Header>
      <Modal.Body className={styles['modal-body']}>
        <div>
          <form noValidate={true} onSubmit={(e) => e.preventDefault()} autoComplete="off">
            <div className={styles['form-name']}>
              <div className={['form-group', 'form-input'].join(' ')}>
                <input
                  type="text"
                  id="nameInput"
                  name="name"
                  className={[
                    'form-group',
                    nameError ? ['input-error', styles['input-error']].join(' ') : null].join(' ')}
                  placeholder="Name"
                  onChange={(event) => setNameValue(event.currentTarget.value)}
                  value={nameValue}
                />
                <label htmlFor="nameInput">Name</label>
              </div>
            </div>
            <div className={styles['form-duration']}>
              <DurationSection
                type="From"
                values={fromDurationValue}
                errors={fromDurationError}
                setValue={setFromDurationValue}
              />
              <div className={styles.separator} />
              <DurationSection
                type="To"
                values={toDurationValue}
                errors={toDurationError}
                setValue={setToDurationValue}
              />
            </div>
            <div className={styles['form-color']}>
              Color
            </div>
            <div className={styles['form-repeating']}>
              Repeating
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default NewEventModal;
