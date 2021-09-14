import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { addDateEvent } from '../../store/dateSlice';
import DurationSection from './durationSection';
import ColorSection from './colorSection';
import * as util from '../../util';
import styles from './actions.module.scss';

type NewEventModalProps = {
  show: boolean,
  handleClose: () => void,
};

const NewEventModal = ({ show, handleClose }: NewEventModalProps): JSX.Element => {
  const selectedDate = useSelector((state: RootState) => state.date.selectedDate);
  const dispatch = useDispatch<AppDispatch>();
  // Default State
  const defaultName = '';
  const defaultDate = {
    minute: '0',
    hour: `${selectedDate.hour}`,
    day: `${selectedDate.day}`,
    month: `${selectedDate.month}`,
    year: `${selectedDate.year}`,
  };
  const defaultColor = 'green';
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
  const [nameValue, setNameValue] = useState(defaultName);
  const [fromDurationValue, setFromDurationValue] = useState(defaultDate);
  const [toDurationValue, setToDurationValue] = useState(defaultDate);
  const [colorValue, setColorValue] = useState(defaultColor);
  // const [repeatingValue, setRepeatingValue] = useState(false);

  const resetErrors = (): void => {
    setNameError(false);
    setToDurationError({
      minute: false,
      hour: false,
      day: false,
      month: false,
      year: false,
    });
    setFromDurationError({
      minute: false,
      hour: false,
      day: false,
      month: false,
      year: false,
    });
  };

  const resetForm = (): void => {
    setNameValue(defaultName);
    setFromDurationValue(defaultDate);
    setToDurationValue(defaultDate);
    setColorValue(defaultColor);
  };

  const handleSubmit = (): void => {
    let validForm = true;
    // Reset error flags
    resetErrors();
    // Change input values into floats to make it easier to validate
    // Reason why I chose floats was to perform correct validation
    // on decmial values. ParseInt would change a '19.2' into 19
    // which will be accepted, but not accurate
    const dateEvent = {
      id: -1,
      name: nameValue,
      from: {
        minute: parseFloat(fromDurationValue.minute),
        hour: parseFloat(fromDurationValue.hour),
        day: parseFloat(fromDurationValue.day),
        month: parseFloat(fromDurationValue.month),
        year: parseFloat(fromDurationValue.year),
      },
      to: {
        minute: parseFloat(toDurationValue.minute),
        hour: parseFloat(toDurationValue.hour),
        day: parseFloat(toDurationValue.day),
        month: parseFloat(toDurationValue.month),
        year: parseFloat(toDurationValue.year),
      },
      color: colorValue,
    };

    // Validate name
    if (!dateEvent.name) {
      validForm = false;
      setNameError(true);
    }

    // Check for any empty date fields or wrong formats (decimals/negatives)
    let emptyDateField = false;
    if (!util.isValidYear(dateEvent.to.year)) {
      emptyDateField = true;
      setToDurationError({
        ...toDurationError,
        year: true,
      });
    }
    if (!util.isValidDay(dateEvent.to.day, dateEvent.to.month, dateEvent.to.year)) {
      emptyDateField = true;
      setToDurationError({
        ...toDurationError,
        day: true,
      });
    }
    if (!util.isValidHour(dateEvent.to.hour)) {
      emptyDateField = true;
      setToDurationError({
        ...toDurationError,
        hour: true,
      });
    }
    if (!util.isValidYear(dateEvent.from.year)) {
      emptyDateField = true;
      setFromDurationError({
        ...fromDurationError,
        year: true,
      });
    }
    if (!util.isValidDay(dateEvent.from.day, dateEvent.from.month, dateEvent.from.year)) {
      emptyDateField = true;
      setFromDurationError({
        ...fromDurationError,
        day: true,
      });
    }
    if (!util.isValidHour(dateEvent.from.hour)) {
      emptyDateField = true;
      setFromDurationError({
        ...fromDurationError,
        hour: true,
      });
    }

    // If form is valid, check if empty date field makes it invalid
    if (validForm) {
      validForm = !emptyDateField;
    }

    // If no empty date fields, validate that 'from' and 'to' dates are
    // not the same and that 'to' is not behind 'from'
    if (!emptyDateField) {
      if (dateEvent.to.year === dateEvent.from.year
        && dateEvent.to.month === dateEvent.from.month
        && dateEvent.to.day === dateEvent.from.day) {
        if (dateEvent.to.hour === dateEvent.from.hour) {
          if (dateEvent.to.minute === dateEvent.from.minute) {
            validForm = false;
            setToDurationError({
              minute: true,
              hour: true,
              day: true,
              month: true,
              year: true,
            });
          } else if (dateEvent.to.minute < dateEvent.from.minute) {
            validForm = false;
            setToDurationError({
              ...toDurationError,
              minute: true,
            });
          }
        } else if (dateEvent.to.hour < dateEvent.from.hour) {
          validForm = false;
          setToDurationError({
            ...toDurationError,
            hour: true,
          });
        }
      }
      if (dateEvent.to.year < dateEvent.from.year) {
        validForm = false;
        setToDurationError({
          ...toDurationError,
          year: true,
        });
      } else if (dateEvent.to.month < dateEvent.from.month) {
        validForm = false;
        setToDurationError({
          ...toDurationError,
          month: true,
        });
      } else if (dateEvent.to.day < dateEvent.from.day) {
        validForm = false;
        setToDurationError({
          ...toDurationError,
          day: true,
        });
      }
    }
    if (validForm) {
      dispatch(addDateEvent(dateEvent));
      resetErrors();
      resetForm();
      handleClose();
    }
  };

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
            {/* <div className={styles['form-repeating']}>
              <input
                type="checkbox"
                id="repeating"
                name="repeating"
                onChange={(event) => setRepeatingValue(event.target.checked)}
              />
              <label htmlFor="repeating">Repeating Event</label>
            </div> */}
            <div className={styles['form-submit']}>
              <button
                type="button"
                className={styles['lightgray-button']}
                onClick={() => {
                  resetErrors();
                  resetForm();
                  handleClose();
                }}
              >
                Cancel
              </button>
              <button type="button" className={styles['blue-button']} onClick={handleSubmit}>
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
