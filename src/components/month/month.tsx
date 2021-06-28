import React from 'react';
import styles from './month.module.scss';
import propTypes from 'prop-types';

Week.propTypes = {
  dates: propTypes.array
}

function Week(props) {
  const days = [];
  for (let i = 0; i < props.dates.length; i++) {
    days.push(<div className={styles.day}>{props.dates[i]}</div>)
  }

  return (
    <div className={styles.week}>
      {days}
    </div>
  )
}

const Month = () => {
  let now = new Date();
  // let day = now.getDate();
  console.log(now);

  return (
    <div className={styles.month}>
      <Week dates={[1, 2, 3, 4, 5, 6, 7]}></Week>
      <Week dates={[8, 9, 10, 11, 12, 13, 14]}></Week>
    </div>
  )
}

export default Month;