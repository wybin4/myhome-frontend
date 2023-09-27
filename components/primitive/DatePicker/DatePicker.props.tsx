import { FirstDayOfWeek, FocusedInput } from "@datepicker-react/hooks";
import { ButtonHTMLAttributes, DetailedHTMLProps, Dispatch, HTMLAttributes, LegacyRef, ReactNode, SetStateAction } from "react";

export interface DatePickerInputProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    choosedDates: Omit<IDateRange, "focusedInput"> | undefined;
    setChoosedDates: Dispatch<SetStateAction<Omit<IDateRange, "focusedInput"> | undefined>>;

    inputTitle?: string;
    inputSize?: "l" | "m" | "s";

    inputError?: string;
}

export interface DatePickerProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    setToday: () => void
    clear: () => void;
    dateRange: IDateRange;
    setDateRange: Dispatch<SetStateAction<IDateRange>>;
    innerRef?: LegacyRef<HTMLDivElement>;
}

export interface DayProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    dayLabel: string;
    date: Date;
}

export interface MonthProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    year: number;
    month: number;
    firstDayOfWeek: FirstDayOfWeek;
}

export interface NavButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    children: ReactNode;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface IDateRange {
    startDate: Date;
    endDate: Date;
    focusedInput: FocusedInput;
}