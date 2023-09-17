import { FirstDayOfWeek } from "@datepicker-react/hooks";
import { ButtonHTMLAttributes, DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

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
