import React from 'react';
import * as util from '../../util';
import { useNonNullContext } from '@/store/calendarContext';

type WeekProps = {
  date: util.DayType,
  selectedDate: Date,
  index: number
};

const Day = ({ index, date, selectedDate }: WeekProps): JSX.Element => {
  const dispatch = useNonNullContext('dispatch');
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const style: string = (event.currentTarget.getAttribute('style') || '');
    const day = parseInt(event.currentTarget.innerHTML, 10);
    const currentDate = new Date(selectedDate.toString());
    currentDate.setDate(day);
    if (style) {
      let color: string = style.split(':')[1].trim();
      color = color.slice(0, color.length - 1);
      if (color === 'gray') {
        if (day > 15) {
          currentDate.setMonth(currentDate.getMonth() - 1);
        } else {
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      }
      dispatch({ type: 'selectNewDate', payload:currentDate.toString() });
    }
  };

  return (
    <button
      type="button"
      style={{ color: `${date.color}`, background: index !== 0 ? 'linear-gradient(lightgray, lightgray) left / 2px 85% no-repeat' : '' }}
      className={`rounded-2 pd-2 pt-1 text-lg md:text-xl lg:text-2xl border-none flex-col ${date.date.getDate() === selectedDate.getDate() && date.color === 'black' ? '!bg-[#b0c4de]' : 'hover:!bg-[#e3e3e3]'}`}
      onClick={handleClick}
    >
      {date.date.getDate()}
    </button>
  );
};

const WeekView = (): JSX.Element => {
  const calendar = useNonNullContext('state');
  const selectedDate = new Date(calendar.selectedDate);
  const daysInWeek: Array<util.DayType> = util.getWeekArray(selectedDate);

  const week: Array<JSX.Element> = [];
  week.push(<div className='text-center text-base md:text-lg lg:text-xl' key="sunday">Sunday</div>);
  week.push(<div className='text-center text-base md:text-lg lg:text-xl' key="monday">Monday</div>);
  week.push(<div className='text-center text-base md:text-lg lg:text-xl' key="tuesday">Tuesday</div>);
  week.push(<div className='text-center text-base md:text-lg lg:text-xl' key="wednesday">Wednesday</div>);
  week.push(<div className='text-center text-base md:text-lg lg:text-xl' key="thursday">Thursday</div>);
  week.push(<div className='text-center text-base md:text-lg lg:text-xl' key="friday">Friday</div>);
  week.push(<div className='text-center text-base md:text-lg lg:text-xl' key="saturday">Saturday</div>);
  for (let i = 0; i < daysInWeek.length; i++) {
    week.push(<Day key={`week${i}`} index={i} date={daysInWeek[i]} selectedDate={selectedDate} />);
  }

  return (
    <div className='grid grid-cols-7 grid-rows-[5%_auto] h-full'>
      {week}
    </div>
  );
};

export default WeekView;
