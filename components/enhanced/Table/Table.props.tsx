import { TableFilterItemProps } from "@/components/composite/TableFilter/TableFilter.props";
import { TableRowProps } from "@/components/composite/TableRow/TableRow.props";
import { HTMLAttributes, DetailedHTMLProps } from "react";

export interface TableProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    buttonTypes: IButtomType[];
    filters: TableFilterItemProps[];
    rows: TableRowProps;
}

export type IButtomType = "download" | "upload" | "add";