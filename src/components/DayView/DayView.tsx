import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { selectNewDate } from '../../store/dateSlice';
import { ISelectedDate } from '../../store/dateTypes';
import * as util from '../../util';
import styles from './DayView.module.scss';

type HourProps = {
  hour: number,
};

const Hour = ({ hour }: HourProps): JSX.Element => {
  const selectedDate = useSelector((state: RootState) => state.date.selectedDate);
  const dispatch = useDispatch<AppDispatch>();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const newDate: ISelectedDate = { ...selectedDate };
    newDate.hour = parseInt(event.currentTarget.innerHTML, 10);
    dispatch(selectNewDate(newDate));
  };

  return (
    <button
      type="button"
      className={[
        styles.hour,
        (hour === selectedDate.hour) ? styles.selected : null,
      ].join(' ')}
      onClick={handleClick}
    >
      {hour}
    </button>
  );
};

const DayView = (): JSX.Element => {
  const schedule = [];
  for (let i = 1; i <= 24; i++) {
    schedule.push(<Hour key={`hour_${i}`} hour={i} />);
  }

  return (
    <div className={styles.container}>
      {schedule}
    </div>
  );
};

export default DayView;