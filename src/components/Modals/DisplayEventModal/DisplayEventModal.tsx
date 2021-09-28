import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { AppDispatch, RootState } from '../../../store/store';
import { IDateEvent } from '../../../store/dateTypes';
import * as util from '../../../util';
import styles from './DisplayEventModal.module.scss';

type DisplayEventModalProps = {
  modalEventId: number,
  show: boolean,
  handleClose: () => void,
};

const DisplayEventModal = ({ modalEventId, show, handleClose }: DisplayEventModalProps): JSX.Element => {
  let currentEvent = useSelector(util.eventIdSelector(modalEventId));
  if (!currentEvent) {
    currentEvent = {
      id: -1,
      color: 'red',
      name: 'Error finding event',
      description: 'Please delete all events in settings and try again',
      to: '',
      from: '',
    };
  }
  return (
    <Modal show={show} onHide={handleClose} dialogClassName={styles['modal-dialog']}>
      <Modal.Header>
        <div className={`${currentEvent.color}-text`}>
          {currentEvent.name}
        </div>
      </Modal.Header>
      <Modal.Body className={styles['modal-body']}>
        <div>
          <div>
            {currentEvent.description}
          </div>
          <div>
            {currentEvent.from}
          </div>
          <div>
            to
          </div>
          <div>
            {currentEvent.to}
          </div>
          <div className={styles['form-submit']}>
            <button type="button" className={styles['lightgray-button']} onClick={handleClose}>
              Cancel
            </button>
            <button type="button" className={styles['blue-button']}>
              Edit Event
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DisplayEventModal;
