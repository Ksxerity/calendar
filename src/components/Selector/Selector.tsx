import React, { useEffect, useState } from 'react';
import * as util from '../../util';
import {
  LeftArrowIcon,
  RightArrowIcon,
} from '../../assets';
import { useNonNullContext } from '@/store/calendarContext';
import { Dialog, DialogHeader, DialogBody, Button, Input } from '@material-tailwind/react';
import Image from 'next/image';

type SelectionModalProps = {
  show: boolean,
  handleClose: () => void,
};

const SelectionModal = ({ show, handleClose }: SelectionModalProps): JSX.Element => {
  const dispatch = useNonNullContext('dispatch');
  const calendar = useNonNullContext('state');
  const selectedDate = new Date(calendar.selectedDate);
  const [yearError, setYearError] = useState(false);
  const [yearValue, setYearValue] = useState(`${selectedDate.getFullYear()}`);

  useEffect(() => {
    setYearValue(`${selectedDate.getFullYear()}`)
  }, [show])

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const yearVal = parseInt(yearValue, 10);
    if (!util.isValidYear(yearVal)) {
      setYearError(true);
    } else {
      setYearError(false);
      const month = parseInt(event.currentTarget.id, 10);
      const daysInMonth = util.getNumberOfDaysInMonth((new Date(yearVal, month, 1)));
      const day = selectedDate.getDate() > daysInMonth ? daysInMonth : selectedDate.getDate();
      const newDate = new Date(yearVal, month, day, selectedDate.getHours());
      dispatch({ type: 'selectNewDate', payload: newDate.toString() });
      handleClose();
    }
  };

  const generateMonthElements = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthElements: JSX.Element[] = [];
    for (let i = 0; i < months.length; i += 1) {
      monthElements.push(<Button key={`${months[i]}`} id={`${i}`} className='m-0.5 bg-transparent border-2 border-solid border-[lightgray] rounded text-sm md:text-base lg:text-lg text-[#34495e] hover:bg-[#e3e3e3] normal-case' onClick={handleSubmit}>{months[i]}</Button>)
    }
    return monthElements;
  }

  return (
    <Dialog open={show} handler={handleClose} size='xs'>
      <DialogHeader className='flex justify-center w-full pb-0 mt-2'>
        <form className='w-3/5' noValidate={true} onSubmit={(e) => e.preventDefault()} autoComplete="off">
          <Input
            type="number"
            variant="static"
            inputMode="numeric"
            label={`${yearError ? 'Year (Invalid - Do not precede 1970)' : 'Year'}`}
            error={yearError}
            onChange={(event) => setYearValue(event.currentTarget.value)}
            value={yearValue}
          />
        </form>
      </DialogHeader>
      <DialogBody className='grid grid-cols-3'>
        {generateMonthElements()}
      </DialogBody>
    </Dialog>
  );
};

const Selector = (): JSX.Element => {
  const dispatch = useNonNullContext('dispatch');
  const calendar = useNonNullContext('state');
  const [show, setShow] = useState(false);
  const selectedDate = new Date(calendar.selectedDate);
  const calendarView = calendar.calendarView;

  const populateMonthLabel = (): string => {
    let monthLabel: string = selectedDate.toLocaleString('default', { month: 'long' });
    if (calendarView === 'day') {
      monthLabel = `${monthLabel} ${selectedDate.getDate()}`;
      if (selectedDate.getFullYear() !== new Date().getFullYear()) {
        monthLabel = `${monthLabel},`;
      }
    }
    if (selectedDate.getFullYear() !== new Date().getFullYear()) {
      monthLabel = `${monthLabel} ${selectedDate.getFullYear()}`;
    }
    return monthLabel;
  };

  const handleArrowClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const currentDate = new Date(selectedDate.toString());
    currentDate.setMinutes(0);
    if (calendarView === 'month') {
      const numberOfDaysInNewMonth: number = util.getNumberOfDaysInMonth(currentDate);
      currentDate.setDate(currentDate.getDate() > numberOfDaysInNewMonth ? numberOfDaysInNewMonth : currentDate.getDate());
      if (event.currentTarget.id === 'prev') {
        currentDate.setMonth(currentDate.getMonth() - 1);
      } else if (event.currentTarget.id === 'next') {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    } else if (calendarView === 'week') {
      if (event.currentTarget.id === 'prev') {
        currentDate.setDate(currentDate.getDate() - 7);
      } else if (event.currentTarget.id === 'next') {
        currentDate.setDate(currentDate.getDate() + 7);
      }
    } else if (calendarView === 'day') {
      if (event.currentTarget.id === 'prev') {
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (event.currentTarget.id === 'next') {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    dispatch({ type:'selectNewDate', payload: currentDate.toString() })
  };

  return (
    <div className='flex justify-between'>
      <SelectionModal show={show} handleClose={() => setShow(false)} />
      <Button variant="text" id="prev" onClick={handleArrowClick} className='hover:bg-[#e3e3e3]'>
        <Image src={LeftArrowIcon} alt="Left arrow button" className='max-h-[11vh]' />
      </Button>
      <Button variant="text" onClick={() => setShow(true)} className='text-3xl md:text-4xl lg:text-5xl text-[#34495e] hover:bg-[#e3e3e3] normal-case'>
        {populateMonthLabel()}
      </Button>
      <Button variant="text" id="next" onClick={handleArrowClick} className='hover:bg-[#e3e3e3]'>
        <Image src={RightArrowIcon} alt="Right arrow button" className='max-h-[11vh]' />
      </Button>
    </div>
  );
};

export default Selector;
