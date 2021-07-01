import React from 'react';
import {
  CalendarViewIcon,
  JumpToNowIcon,
  NewEventIcon,
  SettingsIcon,
} from '../../assets';
import styles from './actions.module.scss';

type ActionButtonProps = {
  src: string,
  id: string,
  alt: string,
};

const ActionButton = (props: ActionButtonProps): JSX.Element => {
  const { src, id, alt } = props;
  return (
    <button type="button" id={id} className={styles['action-icon']}>
      <img src={src} alt={alt} className={styles.icon} />
    </button>
  );
};

const Actions = (): JSX.Element => {
  return (
    <div className={styles.container}>
      <div>TIME GOES HERE</div>
      <div className={styles.actions}>
        <ActionButton src={NewEventIcon} id="NewEvent" alt="New Event Action" />
        <ActionButton src={JumpToNowIcon} id="JumpToNow" alt="Nump To Current Date Action" />
        <ActionButton src={CalendarViewIcon} id="CalendarView" alt="Change Calendar View Action" />
        <ActionButton src={SettingsIcon} id="Settings" alt="Settings Action" />
      </div>
    </div>
  );
};

export default Actions;
