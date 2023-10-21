/* eslint-disable @typescript-eslint/no-explicit-any */
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { ActionProps } from "./Action/Action.props";

export type RowType = "tag" | "text" | "attachment" | "icon" | "none";

export interface TableRowProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    startIcon?: any;
    actions?: ActionProps;
    ids: number[];
    items: ITableRowArr[];
    keyElements?: RowKeyElements;
}

export interface RowKeyElements {
    first: number[];
    isSecondNoNeedTitle?: boolean;
    second: number;
    tags?: number[];
}

export interface TableRowItemMobileProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    startIcon?: any;
    actions?: ActionProps;
    elId: number;
    items?: ITableRowItem[];
    keyElements: RowKeyElements;
}

export interface TableRowItemDesktopProps extends DetailedHTMLProps<HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement> {
    startIcon?: any;
    elId: number;
    items: ITableRowItem[];
    actions?: ActionProps;
}

export interface ITableRowItem {
    title: string;
    type: RowType;
    item?: string;
    infoItem?: string;
    icons?: ITableRowIcon[];
}

export interface ITableRowArr {
    title: string;
    type: RowType;
    items: string[];
    infoItems?: string[];
    icons?: ITableRowIcon[];
}

export interface ITableRowIcon {
    key: string;
    icon: any;
}

export interface TableAttachmentProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    text?: string;
}

export interface TableTextProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    text?: string;
}

export interface TableTagProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    text?: string;
    appearance?: "primary" | "primary-border";
}

export type ITypeOfAction = "editAndSave" | "delete" | "addComment" | "download" | "view";