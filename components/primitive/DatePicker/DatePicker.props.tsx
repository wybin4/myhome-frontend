import { FirstDayOfWeek, FocusedInput } from "@datepicker-react/hooks";
import { ButtonHTMLAttributes, DetailedHTMLProps, Dispatch, HTMLAttributes, LegacyRef, ReactNode, SetStateAction } from "react";

export interface DatePickerInputProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    choosedDates: string;
    setChoosedDates: Dispatch<SetStateAction<string>>;

    inputTitle?: string;
    inputSize?: "l" | "m" | "s";

    inputError?: string;
}

export interface DatePickerProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    setChoosedDates: Dispatch<SetStateAction<string>>;
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