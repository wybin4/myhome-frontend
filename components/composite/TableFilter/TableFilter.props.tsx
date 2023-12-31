import { IBaseDateRange } from "@/components/primitive/DatePicker/DatePicker.props";
import { DetailedHTMLProps, Dispatch, HTMLAttributes, MutableRefObject, SetStateAction } from "react";

export interface TableFilterProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    items: TableFilterItemProps[];

    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;

    filterButtonRef: MutableRefObject<null>;

    isOne: boolean;
}

export interface TableFilterItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    titleEng: string;

    type: "date" | "checkboxWithoutSearch" | "checkbox" | "number";
    items?: ITableFilterItem[];

    numberText?: string;

    isRadio?: boolean;

    handleClick?: (value: string[], id: string) => Promise<void>;
    handleDateRangeClick?: (value: IBaseDateRange | undefined, id: string) => Promise<void>;
}

export interface ITableFilterItem { value: string | number; text: string; }