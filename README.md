# Calendar Webpage

**Work in progress**

A calendar webpage for scheduling events.\
Demo site - https://ksxerity-calendar.herokuapp.com/

## Features
  - Fully functional calendar page that will populate the correct dates based on the month and year
  - Month/Week/Day views for the calendar
  - Create events to keep track of tasks and meetings
  - Events are color coordinated so that they are visually accessible

## WIP
  - Week/Day views are still being configured to show events
  - Settings button and what will appear in it are still being considered

## Development decisions

### Currently running React 19 with @types/react 18
  - https://github.com/creativetimofficial/material-tailwind/issues/528
  - The component library I am using has type issues with @types/react v19
  - Will have to run `npm install --legacy-peer-deps` in the meantime