import { createContext, Dispatch, useContext } from "react";
import { DateState, ActionTypes } from "./dateTypes";

export const CalendarContext = createContext<DateState | null>(null);
export const CalendarDispatchContext = createContext<Dispatch<ActionTypes> | null>(null);

type StateOrDispatchContext<T extends 'state' | 'dispatch'> = T extends 'state' ? DateState : Dispatch<ActionTypes>;

export function useNonNullContext<T extends 'state' | 'dispatch'>(type: T): StateOrDispatchContext<T> {
    if (type === 'state') {
        const calendar = useContext(CalendarContext);
        if (!calendar) {
            throw new Error('ERROR: state is null');
        }
        return calendar as StateOrDispatchContext<T>;
    } else {
        const dispatch = useContext(CalendarDispatchContext);
        if (!dispatch) {
            throw new Error('ERROR: dispatch is null');
        }
        return dispatch as StateOrDispatchContext<T>;
    }
}