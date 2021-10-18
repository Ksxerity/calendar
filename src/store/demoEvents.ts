import { IDateEvent } from './dateTypes';

const eventArray: Array<IDateEvent> = [];

const currentDate: Date = new Date();

const event1: IDateEvent = (() => {
  const from = new Date();
  from.setDate(17);
  from.setHours(8);
  from.setMinutes(0);
  from.setSeconds(0);
  const to = new Date();
  to.setDate(17);
  to.setHours(9);
  to.setMinutes(0);
  to.setSeconds(0);
  return {
    id: 1,
    name: '1 Hour Event',
    from: from.toString(),
    to: to.toString(),
    color: 'green',
    description: 'An event that spans an hour.',
  };
})();

eventArray.push(event1);

const event2: IDateEvent = (() => {
  const from = new Date();
  from.setDate(10);
  from.setHours(0);
  from.setMinutes(0);
  from.setSeconds(0);
  const to = new Date();
  to.setDate(16);
  to.setHours(0);
  to.setMinutes(0);
  to.setSeconds(0);
  return {
    id: 2,
    name: '1 Week Event',
    from: from.toString(),
    to: to.toString(),
    color: 'lightgreen',
    description: 'An event that spans a week.',
  };
})();

eventArray.push(event2);

const event3: IDateEvent = (() => {
  const from = new Date();
  from.setDate(11);
  from.setHours(0);
  from.setMinutes(0);
  from.setSeconds(0);
  const to = new Date();
  to.setDate(15);
  to.setHours(0);
  to.setMinutes(0);
  to.setSeconds(0);
  return {
    id: 3,
    name: '5 Day Event',
    from: from.toString(),
    to: to.toString(),
    color: 'orange',
    description: 'An event that spans 5 days.',
  };
})();

eventArray.push(event3);

const event4: IDateEvent = (() => {
  const from = new Date();
  from.setDate(27);
  from.setMonth(currentDate.getMonth() - 1);
  from.setHours(0);
  from.setMinutes(0);
  from.setSeconds(0);
  const to = new Date();
  to.setDate(1);
  to.setHours(0);
  to.setMinutes(0);
  to.setSeconds(0);
  return {
    id: 4,
    name: 'Multi Month Event',
    from: from.toString(),
    to: to.toString(),
    color: 'red',
    description: 'An event that spans over the previous month and current month.',
  };
})();

eventArray.push(event4);

const event5: IDateEvent = (() => {
  const from = new Date();
  from.setDate(28);
  from.setHours(0);
  from.setMinutes(0);
  from.setSeconds(0);
  const to = new Date();
  to.setDate(1);
  to.setMonth(to.getMonth() + 1);
  to.setHours(0);
  to.setMinutes(0);
  to.setSeconds(0);
  return {
    id: 5,
    name: 'Multi Month Event',
    from: from.toString(),
    to: to.toString(),
    color: 'blue',
    description: 'An event that spans over the current month and next month.',
  };
})();

eventArray.push(event5);

const event6: IDateEvent = (() => {
  const from = new Date();
  from.setDate(5);
  from.setHours(0);
  from.setMinutes(0);
  from.setSeconds(0);
  const to = new Date();
  to.setDate(6);
  to.setHours(0);
  to.setMinutes(0);
  to.setSeconds(0);
  return {
    id: 6,
    name: '2 Day Event',
    from: from.toString(),
    to: to.toString(),
    color: 'yellow',
    description: 'An event that spans over 2 days.',
  };
})();

eventArray.push(event6);

const event7: IDateEvent = (() => {
  const from = new Date();
  from.setDate(18);
  from.setHours(10);
  from.setMinutes(0);
  from.setSeconds(0);
  const to = new Date();
  to.setDate(18);
  to.setHours(12);
  to.setMinutes(0);
  to.setSeconds(0);
  return {
    id: 7,
    name: '2 Hour Event',
    from: from.toString(),
    to: to.toString(),
    color: 'purple',
    description: 'An event that spans over 2 hours.',
  };
})();

eventArray.push(event7);

const event8: IDateEvent = (() => {
  const from = new Date();
  from.setDate(19);
  from.setHours(12);
  from.setMinutes(0);
  from.setSeconds(0);
  const to = new Date();
  to.setDate(19);
  to.setHours(16);
  to.setMinutes(0);
  to.setSeconds(0);
  return {
    id: 8,
    name: '4 Hour Event',
    from: from.toString(),
    to: to.toString(),
    color: 'red',
    description: 'An event that spans over 4 hours.',
  };
})();

eventArray.push(event8);

const event9: IDateEvent = (() => {
  const from = new Date();
  from.setDate(18);
  from.setHours(12);
  from.setMinutes(0);
  from.setSeconds(0);
  const to = new Date();
  to.setDate(18);
  to.setHours(12);
  to.setMinutes(30);
  to.setSeconds(0);
  return {
    id: 9,
    name: '30 Minute Event',
    from: from.toString(),
    to: to.toString(),
    color: 'green',
    description: 'An event that spans over 30 minutes.',
  };
})();

eventArray.push(event9);

const event10: IDateEvent = (() => {
  const from = new Date();
  from.setDate(17);
  from.setHours(9);
  from.setMinutes(15);
  from.setSeconds(0);
  const to = new Date();
  to.setDate(17);
  to.setHours(9);
  to.setMinutes(30);
  to.setSeconds(0);
  return {
    id: 10,
    name: '15 Minute Event',
    from: from.toString(),
    to: to.toString(),
    color: 'orange',
    description: 'An event that spans over 15 minutes.',
  };
})();

eventArray.push(event10);

const event11: IDateEvent = (() => {
  const from = new Date();
  from.setDate(17);
  from.setHours(11);
  from.setMinutes(45);
  from.setSeconds(0);
  const to = new Date();
  to.setDate(17);
  to.setHours(12);
  to.setMinutes(0);
  to.setSeconds(0);
  return {
    id: 11,
    name: '15 Minute Event',
    from: from.toString(),
    to: to.toString(),
    color: 'red',
    description: 'An event that spans over 15 minutes.',
  };
})();

eventArray.push(event11);

const event12: IDateEvent = (() => {
  const from = new Date();
  from.setDate(17);
  from.setHours(15);
  from.setMinutes(15);
  from.setSeconds(0);
  const to = new Date();
  to.setDate(17);
  to.setHours(16);
  to.setMinutes(0);
  to.setSeconds(0);
  return {
    id: 12,
    name: '45 Minute Event',
    from: from.toString(),
    to: to.toString(),
    color: 'lightgreen',
    description: 'An event that spans over 45 minutes.',
  };
})();

eventArray.push(event12);

const event13: IDateEvent = (() => {
  const from = new Date();
  from.setDate(17);
  from.setHours(8);
  from.setMinutes(0);
  from.setSeconds(0);
  const to = new Date();
  to.setDate(20);
  to.setHours(8);
  to.setMinutes(0);
  to.setSeconds(0);
  return {
    id: 13,
    name: '4 Day Event',
    from: from.toString(),
    to: to.toString(),
    color: 'blue',
    description: 'An event that spans over 4 days.',
  };
})();

eventArray.push(event13);

export default eventArray;
