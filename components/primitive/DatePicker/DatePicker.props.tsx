import { FirstDayOfWeek, FocusedInput } from "@datepicker-react/hooks";
import { ButtonHTMLAttributes, DetailedHTMLProps, Dispatch, HTMLAttributes, LegacyRef, ReactNode, SetStateAction } from "react";

export interface DatePickerInputProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    choosedDate: Date | undefined;
    setChoosedDate: Dispatch<SetStateAction<Date | undefined>>;

    title?: string;
    size?: "l" | "m" | "s";

    inputError?: string;

    numberInOrder?: number;
}

export interface DatePickerRangeProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    choosedDates: Omit<IDateRange, "focusedInput"> | undefined;
    setChoosedDates: Dispatch<SetStateAction<Omit<IDateRange, "focusedInput"> | undefined>>;

    title?: string;
    size?: "l" | "m" | "s";

    inputError?: string;
}

export interface DatePickerRProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    setToday: () => void
    clear: () => void;
    dateRange: IDateRange;
    setDateRange: Dispatch<SetStateAction<IDateRange>>;
    innerRef?: LegacyRef<HTMLDivElement>;
}

export interface DatePickerIProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    setToday: () => void
    clear: () => void;
    date: IDateInput;
    setDate: Dispatch<SetStateAction<IDateInput>>;
    innerRef?: LegacyRef<HTMLDivElement>;
    numberInOrder?: number;
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

export interface IDateInput {
    date: Date;
    focusedInput: FocusedInput;
}