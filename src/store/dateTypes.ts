export interface IEventTime {
  minute: number,
  hour: number,
  day: number,
  month: number,
  year: number,
}

export interface IDateEvent {
  id: number,
  name: string,
  from: string,
  to: string,
  color: string,
  description: string,
  // repeating: boolean
}

export type DateState = {
  selectedDate: string,
  calendarView: string,
  events: IDateEvent[]
};

interface ChangeCalendarViewAction {
  type: 'changeCalendarView';
}

interface SelectNewDateAction {
  type: 'selectNewDate';
  payload: string;
}

interface AddDateEventAction {
  type: 'addDateEvent';
  payload: IDateEvent;
}

interface EditDateEventAction {
  type: 'editDateEvent';
  payload: IDateEvent;
}

interface RemoveDateEventAction {
  type: 'removeDateEvent';
  payload: number;
}

export type ActionTypes = ChangeCalendarViewAction | 
                          SelectNewDateAction | 
                          AddDateEventAction |
                          EditDateEventAction |
                          RemoveDateEventAction;