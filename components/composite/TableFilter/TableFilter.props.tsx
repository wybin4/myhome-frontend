import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface TableFilterProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    items: TableFilterItemProps[];
}

export interface TableFilterItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    titleEng: string;
    type: "date" | "checkboxWithoutSearch" | "checkbox" | "number";
    items?: string[];
    number?: number;
    radio?: boolean;
}