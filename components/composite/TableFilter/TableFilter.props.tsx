import { DetailedHTMLProps, Dispatch, HTMLAttributes, LegacyRef, SetStateAction } from "react";

export interface TableFilterProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    items: TableFilterItemProps[];
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    innerRef?: LegacyRef<HTMLDivElement>;

}

export interface TableFilterItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    titleEng: string;
    type: "date" | "checkboxWithoutSearch" | "checkbox" | "number";
    items?: string[];
    number?: number;
    radio?: boolean;
}