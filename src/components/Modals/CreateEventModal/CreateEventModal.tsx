import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { addDateEvent, editDateEvent } from '../../../store/dateSlice';
import DurationSection from './DurationSection';
import ColorSection from './ColorSection';
import * as util from '../../../util';
import styles from './CreateEventModal.module.scss';
import { IDateEvent } from '../../../store/dateTypes';

type CreateEventModalProps = {
  show: boolean,
  handleClose: () => void,
  // eslint-disable-next-line react/require-default-props
  eventIdToEdit?: number,
};

const defaultEventToEdit: IDateEvent = {
  id: -1,
  name: '',
  from: '',
  to: '',
  color: 'green',
  description: '',
};

const defaultDateValue = (selectedDate: Date, eventDate: string) => {
  const dateObj: Date = (eventDate === '') ? selectedDate : new Date(eventDate);
  return {
    minute: `${dateObj.getMinutes()}`,
    hour: `${dateObj.getHours()}`,
    day: `${dateObj.getDate()}`,
    month: `${dateObj.getMonth()}`,
    year: `${dateObj.getFullYear()}`,
  };
};

const defaultErrorState = {
  minute: false,
  hour: false,
  day: false,
  month: false,
  year: false,
};

const CreateEventModal = ({ show, handleClose, eventIdToEdit = -1 }: CreateEventModalProps): JSX.Element => {
  const selectedDate = new Date(useSelector((state: RootState) => state.date.selectedDate));
  const eventToEdit = useSelector(util.eventIdSelector(eventIdToEdit)) || defaultEventToEdit;
  selectedDate.setMinutes(0);
  const dispatch = useDispatch<AppDispatch>();
  // Initialize Value State
  const [nameValue, setNameValue] = useState(eventToEdit.name);
  const [fromDurationValue, setFromDurationValue] = useState(() => defaultDateValue(selectedDate, eventToEdit.from));
  const [toDurationValue, setToDurationValue] = useState(() => defaultDateValue(selectedDate, eventToEdit.to));
  const [colorValue, setColorValue] = useState(eventToEdit.color);
  const [descriptionValue, setDescriptionValue] = useState(eventToEdit.description);
  // const [repeatingValue, setRepeatingValue] = useState(false);
  // Initialize Error State
  const [nameError, setNameError] = useState(false);
  const [fromDurationError, setFromDurationError] = useState(defaultErrorState);
  const [toDurationError, setToDurationError] = useState(defaultErrorState);

  const resetErrors = (): void => {
    setNameError(false);
    setToDurationError(defaultErrorState);
    setFromDurationError(defaultErrorState);
  };

  const resetForm = (): void => {
    setNameValue(eventToEdit.name);
    setFromDurationValue(defaultDateValue(selectedDate, eventToEdit.from));
    setToDurationValue(defaultDateValue(selectedDate, eventToEdit.to));
    setColorValue(eventToEdit.color);
    setDescriptionValue(eventToEdit.description);
  };

  // Reset form on modal open
  useEffect(() => {
    resetErrors();
    resetForm();
  }, [show, eventToEdit]);

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
      description: descriptionValue,
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

    // If no empty date fields, validate that 'from' and 'to' dates are
    // not the same and that 'to' is not behind 'from'
    if (validForm && !emptyDateField) {
      const start = new Date(
        dateEvent.from.year,
        dateEvent.from.month,
        dateEvent.from.day,
        dateEvent.from.hour,
        dateEvent.from.minute,
      );
      const end = new Date(
        dateEvent.to.year,
        dateEvent.to.month,
        dateEvent.to.day,
        dateEvent.to.hour,
        dateEvent.to.minute,
      );
      if (start.getTime() === end.getTime()) {
        validForm = false;
        setToDurationError({
          minute: true,
          hour: true,
          day: true,
          month: true,
          year: true,
        });
      } else if (end.getTime() < start.getTime()) {
        validForm = false;
        setToDurationError({
          minute: true,
          hour: true,
          day: true,
          month: true,
          year: true,
        });
      }
      if (validForm) {
        const finalEvent = {
          ...dateEvent,
          from: start.toString(),
          to: end.toString(),
        };
        if (eventIdToEdit === -1) {
          dispatch(addDateEvent(finalEvent));
        } else {
          finalEvent.id = eventIdToEdit;
          dispatch(editDateEvent(finalEvent));
        }
        handleClose();
      }
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
            <div className={['form-group', 'form-input', styles['form-description']].join(' ')}>
              <textarea
                id="descriptionInput"
                name="description"
                // rows={5}
                className={['form-group', styles['form-description-box']].join(' ')}
                placeholder="Description"
                onChange={(event) => setDescriptionValue(event.currentTarget.value)}
                value={descriptionValue}
              />
              <label htmlFor="descriptionInput">Description</label>
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
              <button type="button" className={styles['lightgray-button']} onClick={handleClose}>
                Cancel
              </button>
              <button type="button" className={styles['blue-button']} onClick={handleSubmit}>
                {(eventIdToEdit === -1) ? 'Create Event' : 'Edit Event'}
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CreateEventModal;
