import { getNumberOfDaysInMonth, hourTostring } from '@/util';
import { Input, Option, Select } from '@material-tailwind/react';
import React, { JSX, useMemo, useState } from 'react';

type DurationValues = {
  minute: string,
  hour: string,
  day: string,
  month: string,
  year: string,
};

type DurationSectionProps = {
  label: string,
  values: DurationValues,
  error?: boolean,
  setValue: ((value: DurationValues) => void),
};

const DurationSection = (props: DurationSectionProps): JSX.Element => {
  const {
    label,
    values,
    error,
    setValue,
  } = props;
  const [selectedTime, setSelectedTime] = useState(`${hourTostring(values.hour)}:00`);
  const [selectedMonth, setSelectedMonth] = useState(values.month);
  const [selectedDay, setSelectedDay] = useState(values.day);
  const [selectedYear, setSelectedYear] = useState(values.year);

  const generateTimeOptions = useMemo(() => {
    const times: JSX.Element[] = [];
    for (let hour = 0; hour < 24; hour += 1) {
      for (let min = 0; min <= 45; min += 15) {
        const str = `${hourTostring(hour)}:${min === 0 ? '00' : min}`;
        times.push(<Option key={str} value={str}>{str}</Option>)
      }
    }
    return times;
  }, []);

  const generateDayOptions = useMemo(() => {
    const date = new Date(
      parseFloat(values.year),
      parseFloat(values.month),
      1,
    );
    const numberOfDays = getNumberOfDaysInMonth(date);
    const days: JSX.Element[] = [];
    for (let day = 1; day <= numberOfDays; day += 1) {
      days.push(<Option key={`day${day}`} value={`${day}`}>{day}</Option>)
    }
    return days;
  }, []);

  const generateYearOptions = useMemo(() => {
    const currYear = parseFloat(values.year);
    const years: JSX.Element[] = [];
    for (let year = currYear - 30; year < currYear + 30; year += 1) {
      years.push(<Option key={`year${year}`} value={`${year}`}>{year}</Option>)
    }
    return years;
  }, []);

  return (
    <div className='flex flex-col'>
      <div className={`pb-3 ${error ? 'text-red-500' : ''}`}>
        {`${label}${error ? ' (Date occurs before the "From" date above)' : ''}`}
      </div>
      <div className='flex gap-x-[5px]'>
        <div className='w-28'>
          <Select
            label='Month'
            onChange={(event) => {
              if (event) {
                setValue({
                  ...values,
                  month: event,
                });
                setSelectedMonth(event);
              }
            }}
            value={selectedMonth}
          >
            <Option value="0">January</Option>
            <Option value="1">February</Option>
            <Option value="2">March</Option>
            <Option value="3">April</Option>
            <Option value="4">May</Option>
            <Option value="5">June</Option>
            <Option value="6">July</Option>
            <Option value="7">August</Option>
            <Option value="8">September</Option>
            <Option value="9">October</Option>
            <Option value="10">November</Option>
            <Option value="11">December</Option>
          </Select>
        </div>
        <div className='w-20'>
          <Select
            label='Day'
            onChange={(event) => {
              if (event) {
                setValue({
                  ...values,
                  day: event,
                })
                setSelectedDay(event);
              }
            }}
            value={selectedDay}
          >
            {generateDayOptions}
          </Select>
        </div>
        <div className='w-24'>
          <Select
            label='Year'
            onChange={(event) => {
              if (event) {
                setValue({
                  ...values,
                  year: event,
                })
                setSelectedYear(event);
              }
            }}
            value={selectedYear}
          >
            {generateYearOptions}
          </Select>
        </div>
        <div className='w-24'>
          <Select
            label='Time'
            onChange={(event) => {
              if (event) {
                const [hour, min] = event.split(':');
                setValue({
                  ...values,
                  minute: min,
                  hour: hour,
                })
                setSelectedTime(event);
              }
            }}
            value={selectedTime}
          >
            {generateTimeOptions}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DurationSection;
