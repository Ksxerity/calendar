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

  const handleSelection = (name: string, event: React.ChangeEvent<HTMLSelectElement>): void => {
    if (name === 'minute') {
      setValue({
        ...values,
        minute: parseInt(event.target.value, 10),
      });
    } else if (name === 'month') {
      setValue({
        ...values,
        month: parseInt(event.currentTarget.value, 10),
      });
    }
  };

  return (
    <div className={styles['duration-section']}>
      <div className={styles['duration-type']}>
        {type}
      </div>
      <div className={styles['duration-time']}>
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
        <div className={styles.selection}>
          <div className={styles['selection-label']}>
            Minute
          </div>
          <select onChange={(e) => handleSelection('minute', e)}>
            <option value="0">0</option>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45</option>
          </select>
        </div>
      </div>
      <div className={styles['duration-date']}>
        <div className={[styles.selection].join(' ')}>
          <div className={styles['selection-label']}>
            Month
          </div>
          <select onChange={(e) => handleSelection('month', e)}>
            <option value="0">January</option>
            <option value="1">February</option>
            <option value="2">March</option>
            <option value="3">April</option>
            <option value="4">May</option>
            <option value="5">June</option>
            <option value="6">July</option>
            <option value="7">August</option>
            <option value="8">September</option>
            <option value="9">October</option>
            <option value="10">November</option>
            <option value="11">December</option>
          </select>
        </div>
        <div className={['form-group', 'form-input', styles.day].join(' ')}>
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
        <div className={['form-group', 'form-input', styles.year].join(' ')}>
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
    </div>
  );
};

type ColorSectionProps = {
  selected: string,
  setValue: ((value: string) => void),
};

const ColorSection = (props: ColorSectionProps): JSX.Element => {
  const { selected, setValue } = props;

  return (
    <div className={styles['color-selection']}>
      <button
        type="button"
        className={[selected === 'green' ? styles.selected : null, styles.green, styles['color-button']].join(' ')}
        aria-label="Color Green"
        onClick={() => setValue('green')}
      />
      <button
        type="button"
        className={[selected === 'lightgreen' ? styles.selected : null, styles.lightgreen, styles['color-button']].join(' ')}
        aria-label="Color Lightgreen"
        onClick={() => setValue('lightgreen')}
      />
      <button
        type="button"
        id="blue"
        className={[selected === 'blue' ? styles.selected : null, styles.blue, styles['color-button']].join(' ')}
        aria-label="Color Blue"
        onClick={() => setValue('blue')}
      />
      <button
        type="button"
        id="red"
        className={[selected === 'red' ? styles.selected : null, styles.red, styles['color-button']].join(' ')}
        aria-label="Color Red"
        onClick={() => setValue('red')}
      />
      <button
        type="button"
        id="orange"
        className={[selected === 'orange' ? styles.selected : null, styles.orange, styles['color-button']].join(' ')}
        aria-label="Color Orange"
        onClick={() => setValue('orange')}
      />
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
  const [colorValue, setColorValue] = useState('green');
  const [repeatingValue, setRepeatingValue] = useState(false);

  return (
    <Modal show={show} onHide={handleClose} dialogClassName={styles['modal-dialog']}>
      <Modal.Header>
        Create New Event
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
              <ColorSection
                selected={colorValue}
                setValue={setColorValue}
              />
            </div>
            <div className={styles['form-repeating']}>
              <input
                type="checkbox"
                id="repeating"
                name="repeating"
                onChange={(event) => setRepeatingValue(event.target.checked)}
              />
              <label htmlFor="repeating">Repeating Event</label>
            </div>
            <div className={styles['form-submit']}>
              <button type="button">
                Cancel
              </button>
              <button type="button">
                Create Event
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default NewEventModal;
