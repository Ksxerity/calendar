export interface IDateEvent {
  id: number,
  name: string,
  from: object,
  to: object,
  color: string,
  repeating: boolean
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
}