import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import styles from './Actions.module.scss';

type DurationErrors = {
  minute: boolean,
  hour: boolean,
  day: boolean,
  month: boolean,
  year: boolean,
};

type DurationValues = {
  minute: string,
  hour: string,
  day: string,
  month: string,
  year: string,
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
        minute: event.target.value,
      });
    } else if (name === 'month') {
      setValue({
        ...values,
        month: event.currentTarget.value,
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
              hour: event.currentTarget.value,
            })}
            value={values.hour}
          />
          <label htmlFor="hour">Hour</label>
        </div>
        <div className={[
          styles.selection,
          errors.minute ? styles['selection-error'] : null].join(' ')}
        >
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
        <div className={[
          styles.selection,
          errors.minute ? styles['selection-error'] : null].join(' ')}
        >
          <div className={styles['selection-label']}>
            Month
          </div>
          <select onChange={(e) => handleSelection('month', e)} defaultValue={values.month}>
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
            id={`day_${type}`}
            className={[
              'form-group',
              errors.day ? ['input-error', styles['input-error']].join(' ') : null].join(' ')}
            placeholder="Day"
            onChange={(event) => setValue({
              ...values,
              day: event.currentTarget.value,
            })}
            value={values.day}
          />
          <label htmlFor={`day_${type}`}>Day</label>
        </div>
        <div className={['form-group', 'form-input', styles.year].join(' ')}>
          <input
            type="number"
            name="year"
            className={[
              'form-group',
              errors.year ? ['input-error', styles['input-error']].join(' ') : null].join(' ')}
            placeholder="Year"
            onChange={(event) => setValue({
              ...values,
              year: event.currentTarget.value,
            })}
            value={values.year}
          />
          <label htmlFor="year">Year</label>
        </div>
      </div>
    </div>
  );
};

export default DurationSection;
