/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";

export const datepickerContextDefaultValue = {
    focusedDate: null as Date | null,
    isDateFocused: (date: Date) => false,
    isDateSelected: (date: Date) => false,
    isDateHovered: (date: Date) => false,
    isDateBlocked: (date: Date) => false,
    isFirstOrLastSelectedDate: (date: Date) => false,
    onDateFocus: (date: Date) => { },
    onDateHover: (date: Date) => { },
    onDateSelect: (date: Date) => { }
};


export default createContext(datepickerContextDefaultValue);
