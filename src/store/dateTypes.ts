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
  // repeating: boolean
}

export type DateState = {
  selectedDate: string,
  calendarView: string,
  events: IDateEvent[]
};
