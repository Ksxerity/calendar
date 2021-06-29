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
  year: number
}

export type DateState = {
  selectedDate: ISelectedDate,
  events: IDateEvent[]
}