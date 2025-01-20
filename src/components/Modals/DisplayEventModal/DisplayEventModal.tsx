import React from 'react';
import { IDateEvent } from '../../../store/dateTypes';
import * as util from '../../../util';
import { Dialog, DialogHeader, DialogBody, Button, DialogFooter } from '@material-tailwind/react';
import { useNonNullContext } from '@/store/calendarContext';

type DisplayEventModalProps = {
  eventId: number,
  show: boolean,
  handleClose: () => void,
  handleShowEditModal: () => void,
};

type ValidEventModalProps = {
  currentEvent: IDateEvent,
  show: boolean,
  handleClose: () => void,
  handleShowEditModal: () => void,
};

type InvalidEventModalProps = {
  show: boolean,
  handleClose: () => void,
};

const InvalidEventModal = ({ show, handleClose }: InvalidEventModalProps): JSX.Element => {
  return (
    <Dialog open={show} handler={handleClose}>
      <DialogHeader>Cannot find event</DialogHeader>
      <DialogBody>
        We were unable to find the event with this event ID. Please click settings and delete cookies and try again.
      </DialogBody>
    </Dialog>
  );
};

const ValidEventModal = (props: ValidEventModalProps): JSX.Element => {
  const dispatch = useNonNullContext('dispatch');
  const {
    currentEvent,
    show,
    handleClose,
    handleShowEditModal,
  } = props;
  const populateEventDayLabel = (date: string): string => {
    const currentDate: Date = new Date(date);
    const weekdayLabel: string = currentDate.toLocaleString('default', { weekday: 'long' });
    return weekdayLabel;
  };
  const populateEventDateLabel = (date: string): string => {
    const currentDate: Date = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    const dateLabel: string = currentDate.toLocaleString('default', options);
    return dateLabel;
  };
  const populateEventTimeLabel = (date: string): string => {
    const currentDate: Date = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      minute: 'numeric',
      hour: 'numeric',
    };
    const timeLabel: string = currentDate.toLocaleString('default', options);
    return timeLabel;
  };
  const handleDelete = () => {
    handleClose();
    dispatch({ type: 'removeDateEvent', payload: currentEvent.id })
  };
  const handleEdit = () => {
    handleShowEditModal();
  };
  return (
    <Dialog open={show} handler={handleClose} className='flex flex-col' size='xs'>
      <DialogHeader className={`text-${currentEvent.color} m-0 m-auto pb-0`}>{currentEvent.name}</DialogHeader>
      <DialogBody className='flex flex-col items-center'>
        <div className='pb-2'>
          {currentEvent.description}
        </div>
        <div className='flex flex-col items-center'>
          <span>{populateEventDayLabel(currentEvent.from)}</span>
          <span>{populateEventDateLabel(currentEvent.from)}</span>
          <span>{populateEventTimeLabel(currentEvent.from)}</span>
        </div>
        <div className='grid grid-cols-[minmax(0,_1fr)_10%_minmax(0,_1fr)] grid-rows-2 my-4 w-full'>
          <div style={{ background: 'linear-gradient(lightgray, lightgray) bottom / 80% 2px no-repeat' }} />
          <div className='col-start-2 col-end-3 row-start-1 row-end-4 m-0 m-auto'>
            to
          </div>
          <div style={{ background: 'linear-gradient(lightgray, lightgray) bottom / 80% 2px no-repeat' }}  />
        </div>
        <div className='flex flex-col items-center'>
          <span>{populateEventDayLabel(currentEvent.to)}</span>
          <span>{populateEventDateLabel(currentEvent.to)}</span>
          <span>{populateEventTimeLabel(currentEvent.to)}</span>
        </div>
      </DialogBody>
      <DialogFooter className='flex justify-between'>
        <Button
          variant="filled"
          color="red"
          onClick={handleDelete}
        >
          Delete Event
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleEdit}
        >
          Edit Event
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

const DisplayEventModal = (props: DisplayEventModalProps): JSX.Element => {
  const {
    eventId,
    show,
    handleClose,
    handleShowEditModal,
  } = props;
  const currentEvent = util.getEventById(eventId);
  if (!currentEvent) {
    return <InvalidEventModal show={show} handleClose={handleClose} />;
  }
  return (
    <ValidEventModal
      currentEvent={currentEvent}
      show={show}
      handleClose={handleClose}
      handleShowEditModal={handleShowEditModal}
    />
  );
};

export default DisplayEventModal;
