import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { selectNewDate } from '../../store/dateSlice';
import { ISelectedDate } from '../../store/dateTypes';
import * as util from '../../util';
import styles from './selector.module.scss';
import {
  LeftArrow,
  RightArrow,
} from '../../assets';

let selectedDate: ISelectedDate;
let dispatch: AppDispatch;
let daysInMonth: Array<Array<util.DayType>>;

const Selector = (): JSX.Element => {
  selectedDate = useSelector((state: RootState) => state.date.selectedDate);
  dispatch = useDispatch<AppDispatch>();

  return (
    <div className={styles.selector}>
      <button type="button" className={styles['select-prev']}>
        <img src={LeftArrow} alt="Left arrow button" />
      </button>
      <button type="button" className={styles['select-month']}>
        {new Date(selectedDate.year, selectedDate.month, selectedDate.day).toLocaleString('default', { month: 'long' })}
      </button>
      <button type="button" className={styles['select-next']}>
        <img src={RightArrow} alt="Right arrow button" />
      </button>
    </div>
  );
};

export default Selector;
