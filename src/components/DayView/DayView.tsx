import React, { JSX } from 'react';
import { useNonNullContext } from '@/store/calendarContext';

type HourProps = {
  hour: number,
};

const Hour = ({ hour }: HourProps): JSX.Element => {
  const dispatch = useNonNullContext('dispatch');
  const calendar = useNonNullContext('state');
  const selectedDate = new Date(calendar.selectedDate);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const newHour = parseInt(event.currentTarget.innerHTML, 10);
    selectedDate.setHours(newHour);
    dispatch({type: 'selectNewDate', payload: selectedDate.toString() })
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        background: `${hour === 24 ? '' : 'linear-gradient(lightgray, lightgray) bottom / 90% 2px no-repeat'}`
      }}
      className={`rounded-[10px] pt-2 text-base md:text-lg lg:text-xl border-none ${hour === selectedDate.getHours() ? '!bg-[#b0c4de]' : 'hover:!bg-[#e3e3e3]'}`}
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
    <div className='grid grid-cols-24 h-full'>
      {schedule}
    </div>
  );
};

export default DayView;
