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
  from: IEventTime,
  to: IEventTime,
  color: string,
  // repeating: boolean
}

export interface ISelectedDate {
  month: number,
  day: number,
  year: number,
  hour: number
}

export type DateState = {
  selectedDate: ISelectedDate,
  calendarView: string,
  events: IDateEvent[]
};
