import React, { JSX, useContext, useState } from 'react';
import * as util from '../../util';
import { CreateEventModal } from '../Modals';
import {
  CalendarViewIcon,
  JumpToNowIcon,
  NewEventIcon,
  SettingsIcon,
} from '../../assets';
import { useNonNullContext } from '@/store/calendarContext';
import { StaticImageData } from 'next/image';
import Image from 'next/image';
import { Button, Tooltip, Typography } from '@material-tailwind/react';

type ActionButtonProps = {
  src: StaticImageData,
  id: string,
  alt: string,
  setShow: ((show: boolean) => void) | null,
};

const ActionButton = (props: ActionButtonProps): JSX.Element => {
  const dispatch = useNonNullContext('dispatch');
  const {
    src,
    id,
    alt,
    setShow,
  } = props;

  const returnToCurrentDate = (): void => {
    const dateObject: Date = util.getCurrentDate();
    dispatch({type: 'selectNewDate', payload: dateObject.toString()});
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
        dispatch({type: 'changeCalendarView'});
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
    <Tooltip
      placement="bottom"
      className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
      content={
        <Typography color="blue-gray">
          {alt}
        </Typography>
      }
    >
      <Button 
        variant="text" 
        id={id} 
        data-tooltip={alt} 
        onClick={handleClick}
        className="p-[3px]"
      >
        <Image src={src} alt={alt} className='max-h-[5vh] max-w-[5vh] rounded-[50%] p-[.2rem] border-[3px] border-[#63b0e3] hover:bg-[#e3e3e3]' />
      </Button>
    </Tooltip>
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
    <div className='flex justify-between items-center m-1.5'>
      <CreateEventModal show={showEventModal} handleClose={() => setShowEventModal(false)} />
      <Typography className='text-[#34495e] md:text-xl lg:text-2xl xl:text-3xl'>
        {populateCurrentDateLabel()}
      </Typography>
      <div>
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
