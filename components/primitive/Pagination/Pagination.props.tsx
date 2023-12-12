import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction } from "react";

export interface PaginationProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    itemsPerPage: number;
    itemsCount: number;

    setItemOffset: Dispatch<SetStateAction<number>>;
    handlePaginate?: (selected: number) => Promise<void>;
}