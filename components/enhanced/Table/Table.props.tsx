import { TableButtonType } from "@/components/composite/TableButton/TableButton.props";
import { TableFilterItemProps } from "@/components/composite/TableFilter/TableFilter.props";
import { TableRowProps } from "@/components/composite/TableRow/TableRow.props";
import { TableSearchProps } from "@/components/primitive/TableSearch/TableSearch.props";
import { HTMLAttributes, DetailedHTMLProps } from "react";

export interface TableProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title?: string;

    filters?: TableFilterItemProps[];
    rows: TableRowProps;

    buttons?: TableButtonType[];

    search?: TableSearchProps;
    isData: boolean;
}

