import React, { JSX } from 'react';
import { IDateEvent } from '../../../store/dateTypes';
import * as util from '../../../util';
import { Dialog, DialogHeader, DialogBody } from '@material-tailwind/react';

type DisplayAllEventsModalProps = {
  selectedDateString: string,
  show: boolean,
  handleClose: () => void,
  handleShowDisplayModal: (id: number) => void,
};

const DisplayAllEventsModal = (props: DisplayAllEventsModalProps): JSX.Element => {
  const {
    selectedDateString,
    show,
    handleClose,
    handleShowDisplayModal,
  } = props;
  const selectedDate: Date = new Date(selectedDateString);

  const populateEventDateLabel = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    const dateLabel: string = date.toLocaleString('default', options);
    return dateLabel;
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    const eventId: string = (event.currentTarget.getAttribute('data-event-id') || '');
    if (eventId) {
      handleClose();
      handleShowDisplayModal(parseInt(eventId, 10));
    }
  };

  const eventArray: Array<JSX.Element> = [];
  const events: Array<IDateEvent> = util.getEventByDate(selectedDate);
  events.sort(util.eventSorting);
  for (let i = 0; i < events.length; i++) {
    const dateStart: Date = new Date(events[i].from);
    const dateEnd: Date = new Date(events[i].to);
    let eventName: string;
    if (dateEnd.valueOf() - dateStart.valueOf() > 86400000) {
      eventName = events[i].name;
    } else {
      eventName = `${dateStart.getHours()}:${dateStart.getMinutes()}${dateStart.getMinutes() === 0 ? 0 : ''}`;
      if (dateStart.getHours() < 10) {
        eventName = `0${eventName} | ${events[i].name}`;
      } else {
        eventName = `${eventName} | ${events[i].name}`;
      }
    }
    eventArray.push(
      <div
        role="button"
        aria-hidden="true"
        onClick={handleClick}
        data-event-id={events[i].id}
        className={`bg-custom-${events[i].color} rounded-[5px] pl-[5px] text-black`}
      >
        {eventName}
      </div>,
    );
  }

  return (
    <Dialog open={show} handler={handleClose}>
      <DialogHeader>
        {`All events on ${populateEventDateLabel(selectedDate)}`}
      </DialogHeader>
      <DialogBody className='flex flex-col gap-[3px]'>
        {eventArray}
      </DialogBody>
  </Dialog>
  );
};

export default DisplayAllEventsModal;
