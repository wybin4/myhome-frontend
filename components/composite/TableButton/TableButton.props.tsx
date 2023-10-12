import { DetailedHTMLProps, Dispatch, HTMLAttributes, MutableRefObject, SetStateAction } from "react";

export interface TableButtonProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    buttons: TableButtonType[];

    filterAppearance?: "primary" | "ghost";
    isFiltersExist: boolean;
    isFilterOpened: boolean;
    setIsFilterOpened: Dispatch<SetStateAction<boolean>>;
    filterButtonRef: MutableRefObject<null>;
}

export type TableButtonType = {
    type: "download" | "upload" | "add" | "calculate";
    title?: string;
    appearance?: "primary" | "ghost";
    onClick?: () => void;
};