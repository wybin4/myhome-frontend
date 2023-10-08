import { DetailedHTMLProps, Dispatch, HTMLAttributes, MutableRefObject, SetStateAction } from "react";

export interface TableFilterProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    items: TableFilterItemProps[];

    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;

    filterButtonRef: MutableRefObject<null>
}

export interface TableFilterItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    titleEng: string;

    type: "date" | "checkboxWithoutSearch" | "checkbox" | "number";
    items?: string[];

    numberText?: string;

    isRadio?: boolean;

    onClick?: () => void;
}