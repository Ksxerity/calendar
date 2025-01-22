import React, { useState, useEffect, JSX } from 'react';
import DurationSection from './DurationSection';
import ColorSection from './ColorSection';
import * as util from '../../../util';
import { IDateEvent } from '../../../store/dateTypes';
import { useNonNullContext } from '@/store/calendarContext';
import { Dialog, DialogHeader, DialogBody, Button, Input, Textarea } from '@material-tailwind/react';

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

const defaultDateValue = (type: 'from' | 'to', selectedDate: Date, eventDate: string) => {
  const dateObj: Date = (eventDate === '') ? selectedDate : new Date(eventDate);
  if (type === 'to') {
    if (eventDate === '') {
      dateObj.setHours(dateObj.getHours() + 1);
    }
  }
  return {
    minute: `${dateObj.getMinutes()}`,
    hour: `${dateObj.getHours()}`,
    day: `${dateObj.getDate()}`,
    month: `${dateObj.getMonth()}`,
    year: `${dateObj.getFullYear()}`,
  };
};

const CreateEventModal = ({ show, handleClose, eventIdToEdit = -1 }: CreateEventModalProps): JSX.Element => {
  const dispatch = useNonNullContext('dispatch');
  const calendar = useNonNullContext('state');
  const selectedDate = new Date(calendar.selectedDate);
  const eventToEdit = util.getEventById(eventIdToEdit) || defaultEventToEdit;
  selectedDate.setMinutes(0);
  // Initialize Value State
  const [nameValue, setNameValue] = useState(eventToEdit.name);
  const [fromDurationValue, setFromDurationValue] = useState(() => defaultDateValue('from', selectedDate, eventToEdit.from));
  const [toDurationValue, setToDurationValue] = useState(() => defaultDateValue('to', selectedDate, eventToEdit.to));
  const [colorValue, setColorValue] = useState(eventToEdit.color);
  const [descriptionValue, setDescriptionValue] = useState(eventToEdit.description);
  // const [repeatingValue, setRepeatingValue] = useState(false);
  // Initialize Error State
  const [nameError, setNameError] = useState(false);
  const [toDurationError, setToDurationError] = useState(false);

  const resetErrors = (): void => {
    setNameError(false);
    setToDurationError(false);
  };

  const resetForm = (): void => {
    setNameValue(eventToEdit.name);
    setFromDurationValue(defaultDateValue('from', selectedDate, eventToEdit.from));
    setToDurationValue(defaultDateValue('to', selectedDate, eventToEdit.to));
    setColorValue(eventToEdit.color);
    setDescriptionValue(eventToEdit.description);
  };

  // Reset form on modal open
  useEffect(() => {
    resetErrors();
    resetForm();
  }, [show, eventToEdit]);

  const handleSubmit = (): void => {
    // Reset error flags
    resetErrors();
    const dateEvent = {
      id: -1,
      name: nameValue,
      from: {
        minute: parseInt(fromDurationValue.minute),
        hour: parseInt(fromDurationValue.hour),
        day: parseInt(fromDurationValue.day),
        month: parseInt(fromDurationValue.month),
        year: parseInt(fromDurationValue.year),
      },
      to: {
        minute: parseInt(toDurationValue.minute),
        hour: parseInt(toDurationValue.hour),
        day: parseInt(toDurationValue.day),
        month: parseInt(toDurationValue.month),
        year: parseInt(toDurationValue.year),
      },
      color: colorValue,
      description: descriptionValue,
    };

    // Validate name
    if (!dateEvent.name) {
      setNameError(true);
    } else {
      // Validate that 'from' and 'to' dates are
      // not the same and that 'to' is not behind 'from'
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
      if (end.getTime() <= start.getTime()) {
        setToDurationError(true);
      } else {
        const finalEvent = {
          ...dateEvent,
          from: start.toString(),
          to: end.toString(),
        };
        if (eventIdToEdit === -1) {
          dispatch({ type: 'addDateEvent', payload: finalEvent});
        } else {
          finalEvent.id = eventIdToEdit;
          dispatch({ type: 'editDateEvent', payload: finalEvent});
        }
        handleClose();
      }
    }
  };

  return (
    <Dialog open={show} handler={handleClose} size={'xs'}>
      <DialogHeader>{`${ eventIdToEdit > -1 ? 'Edit Event' : 'Create New Event'}`}</DialogHeader>
      <DialogBody className='pt-0'>
        <form noValidate={true} onSubmit={(e) => e.preventDefault()} autoComplete="off">
          <div className='mb-4'>
            <Input
              variant='standard'
              label="Name"
              placeholder="Name"
              onChange={(event) => setNameValue(event.currentTarget.value)}
              value={nameValue}
              error={nameError}
            />
          </div>
          <div className='flex flex-col mb-4 gap-2'>
            <DurationSection
              label="From"
              values={fromDurationValue}
              setValue={setFromDurationValue}
            />
            <DurationSection
              label="To"
              values={toDurationValue}
              error={toDurationError}
              setValue={setToDurationValue}
            />
          </div>
          <div className='flex flex-col justify-center mb-4'>
            Color
            <ColorSection
              selected={colorValue}
              setValue={setColorValue}
            />
          </div>
          <div className='mb-4'>
            <Textarea
              // rows={5}
              label="Description"
              onChange={(event) => setDescriptionValue(event.currentTarget.value)}
              value={descriptionValue}
            />
          </div>
          <div className='flex justify-between'>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {(eventIdToEdit === -1) ? 'Create Event' : 'Edit Event'}
            </Button>
          </div>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default CreateEventModal;
