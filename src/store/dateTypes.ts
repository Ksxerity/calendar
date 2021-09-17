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
  from: Date,
  to: Date,
  color: string,
  // repeating: boolean
}

export type DateState = {
  selectedDate: Date,
  calendarView: string,
  events: IDateEvent[]
};
