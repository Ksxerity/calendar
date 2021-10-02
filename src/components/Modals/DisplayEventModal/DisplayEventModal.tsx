import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { AppDispatch, RootState } from '../../../store/store';
import { removeDateEvent } from '../../../store/dateSlice';
import { IDateEvent } from '../../../store/dateTypes';
import * as util from '../../../util';
import styles from './DisplayEventModal.module.scss';

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
    <Modal show={show} onHide={handleClose} dialogClassName={styles['modal-dialog']}>
      <Modal.Header>
        <div className={['red-text', styles['modal-header']].join(' ')}>
          Cannot find event
        </div>
      </Modal.Header>
      <Modal.Body className={styles['modal-body']}>
        <div className={styles['display-description']}>
          We were unable to find the event with this event ID. Please click settings and delete cookies and try again.
          Though this should never happen...
        </div>
      </Modal.Body>
    </Modal>
  );
};

const ValidEventModal = (props: ValidEventModalProps): JSX.Element => {
  const {
    currentEvent,
    show,
    handleClose,
    handleShowEditModal,
  } = props;
  const dispatch = useDispatch<AppDispatch>();
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
    dispatch(removeDateEvent(currentEvent.id));
  };
  const handleEdit = () => {
    handleClose();
    handleShowEditModal();
  };
  return (
    <Modal show={show} onHide={handleClose} dialogClassName={styles['modal-dialog']}>
      <Modal.Header>
        <div className={[`${currentEvent.color}-text`, styles['modal-header']].join(' ')}>
          {currentEvent.name}
        </div>
      </Modal.Header>
      <Modal.Body className={styles['modal-body']}>
        <div className={styles['display-description']}>
          {currentEvent.description}
        </div>
        <div className={styles['display-date']}>
          <span>{populateEventDayLabel(currentEvent.from)}</span>
          <span>{populateEventDateLabel(currentEvent.from)}</span>
          <span>{populateEventTimeLabel(currentEvent.from)}</span>
        </div>
        <div className={styles['display-to']}>
          <div className={styles['grid-line']} />
          <div className={styles['grid-text']}>
            to
          </div>
          <div className={styles['grid-line']} />
        </div>
        <div className={styles['display-date']}>
          <span>{populateEventDayLabel(currentEvent.to)}</span>
          <span>{populateEventDateLabel(currentEvent.to)}</span>
          <span>{populateEventTimeLabel(currentEvent.to)}</span>
        </div>
        <div className={styles['display-actions']}>
          <button type="button" className={styles['delete-button']} onClick={handleDelete}>
            Delete Event
          </button>
          <button type="button" className={styles['edit-button']} onClick={handleEdit}>
            Edit Event
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const DisplayEventModal = (props: DisplayEventModalProps): JSX.Element => {
  const {
    eventId,
    show,
    handleClose,
    handleShowEditModal,
  } = props;
  const currentEvent = useSelector(util.eventIdSelector(eventId));
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
