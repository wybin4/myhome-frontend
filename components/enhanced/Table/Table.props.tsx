import { TableFilterItemProps } from "@/components/composite/TableFilter/TableFilter.props";
import { TableRowProps } from "@/components/composite/TableRow/TableRow.props";
import { HTMLAttributes, DetailedHTMLProps } from "react";

export interface TableProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;

    filters: TableFilterItemProps[];
    rows: TableRowProps;

    buttons: ITableButton[];

    isSearch?: boolean;
}

export interface ITableButton {
    type: "download" | "upload" | "add";
    onClick?: () => void;
}