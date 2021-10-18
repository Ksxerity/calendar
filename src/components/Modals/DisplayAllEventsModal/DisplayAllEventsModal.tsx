import React from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { IDateEvent } from '../../../store/dateTypes';
import * as util from '../../../util';
import styles from './DisplayAllEventsModal.module.scss';

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
  const events: Array<IDateEvent> = useSelector(util.dayEventSelector(selectedDate));
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
        className={[styles['display-event'], `${events[i].color}-background`].join(' ')}
        onClick={handleClick}
        data-event-id={events[i].id}
      >
        {eventName}
      </div>,
    );
  }

  return (
    <Modal show={show} onHide={handleClose} dialogClassName={styles['modal-dialog']}>
      <Modal.Header>
        <div className={styles['modal-header']}>
          {`All events on ${populateEventDateLabel(selectedDate)}`}
        </div>
      </Modal.Header>
      <Modal.Body className={styles['modal-body']}>
        <div className={styles['display-container']}>
          {eventArray}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DisplayAllEventsModal;
