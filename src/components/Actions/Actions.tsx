import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { changeCalendarView, selectNewDate } from '../../store/dateSlice';
import * as util from '../../util';
import NewEventModal from './NewEventModal';
import {
  CalendarViewIcon,
  JumpToNowIcon,
  NewEventIcon,
  SettingsIcon,
} from '../../assets';
import styles from './Actions.module.scss';

type ActionButtonProps = {
  src: string,
  id: string,
  alt: string,
  setShow: ((show: boolean) => void) | null,
};

const ActionButton = (props: ActionButtonProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    src,
    id,
    alt,
    setShow,
  } = props;

  const returnToCurrentDate = (): void => {
    const dateObject: Date = util.getCurrentDate();
    dispatch(selectNewDate(dateObject.toString()));
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const eventId = event.currentTarget.id;
    switch (eventId) {
      case 'NewEvent':
        if (setShow !== null) {
          setShow(true);
        }
        break;
      case 'JumpToNow':
        returnToCurrentDate();
        break;
      case 'CalendarView':
        dispatch(changeCalendarView());
        break;
      case 'Settings':
        if (setShow !== null) {
          setShow(true);
        }
        break;
      default:
        break;
    }
  };

  return (
    <button type="button" id={id} data-tooltip={alt} className={styles['action-icon']} onClick={handleClick}>
      <img src={src} alt={alt} className={styles.icon} />
    </button>
  );
};

const Actions = (): JSX.Element => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const populateCurrentDateLabel = (): string => {
    const currentDate: Date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    const dateLabel: string = currentDate.toLocaleString('default', options);
    const weekdayLabel: string = currentDate.toLocaleString('default', { weekday: 'long' });
    return `${weekdayLabel} ${dateLabel}`;
  };

  return (
    <div className={styles.container}>
      <NewEventModal show={showEventModal} handleClose={() => setShowEventModal(false)} />
      <div className={styles.date}>
        {populateCurrentDateLabel()}
      </div>
      <div className={styles.actions}>
        <ActionButton
          src={NewEventIcon}
          id="NewEvent"
          alt="Create New Event"
          setShow={(show: boolean) => setShowEventModal(show)}
        />
        <ActionButton
          src={JumpToNowIcon}
          id="JumpToNow"
          alt="Jump To Current Date"
          setShow={null}
        />
        <ActionButton
          src={CalendarViewIcon}
          id="CalendarView"
          alt="Change Calendar View"
          setShow={null}
        />
        <ActionButton
          src={SettingsIcon}
          id="Settings"
          alt="Settings"
          setShow={(show: boolean) => setShowSettingsModal(show)}
        />
      </div>
    </div>
  );
};

export default Actions;
