import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { changeCalendarView, selectNewDate } from '../../store/dateSlice';
import { ISelectedDate } from '../../store/dateTypes';
import * as util from '../../util';
import {
  CalendarViewIcon,
  JumpToNowIcon,
  NewEventIcon,
  SettingsIcon,
} from '../../assets';
import styles from './actions.module.scss';

let dispatch: AppDispatch;

const returnToCurrentDate = (): void => {
  const dateObject: ISelectedDate = util.getCurrentDate();
  dispatch(selectNewDate(dateObject));
};

const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  const { id } = event.currentTarget;
  switch (id) {
    case 'JumpToNow':
      returnToCurrentDate();
      break;
    case 'CalendarView':
      dispatch(changeCalendarView());
      break;
    default:
      break;
  }
};

type ActionButtonProps = {
  src: string,
  id: string,
  alt: string,
};

const ActionButton = (props: ActionButtonProps): JSX.Element => {
  const { src, id, alt } = props;
  return (
    <button type="button" id={id} data-tooltip={alt} className={styles['action-icon']} onClick={handleClick}>
      <img src={src} alt={alt} className={styles.icon} />
    </button>
  );
};

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

const Actions = (): JSX.Element => {
  dispatch = useDispatch<AppDispatch>();

  return (
    <div className={styles.container}>
      <div className={styles.date}>
        {populateCurrentDateLabel()}
      </div>
      <div className={styles.actions}>
        <ActionButton src={NewEventIcon} id="NewEvent" alt="Create New Event" />
        <ActionButton src={JumpToNowIcon} id="JumpToNow" alt="Jump To Current Date" />
        <ActionButton src={CalendarViewIcon} id="CalendarView" alt="Change Calendar View" />
        <ActionButton src={SettingsIcon} id="Settings" alt="Settings" />
      </div>
    </div>
  );
};

export default Actions;
