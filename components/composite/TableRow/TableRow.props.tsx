/* eslint-disable @typescript-eslint/no-explicit-any */
import { DetailedHTMLProps, HTMLAttributes, MouseEventHandler } from "react";

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
}

export interface TableRowItemMobileProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    startIcon?: any;
    actions?: ActionProps;
    elId: number;
    items?: ITableRowItem[];
    keyElements: RowKeyElements;
}

export interface TableRowItemDesktopProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    type: RowType;
    items?: (string | undefined)[];
}

export interface ITableRowItem {
    title: string;
    type: RowType;
    item?: string;
    icons?: ITableRowIcon[];
}

export interface ITableRowArr {
    title: string;
    type: RowType;
    items: string[];
    icons?: ITableRowIcon[];
}

export interface ITableRowIcon {
    key: string;
    icon: any;
}

export interface ActionProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    actions: {
        type: ITypeOfAction;
        onClick: MouseEventHandler<HTMLDivElement>;
    }[];
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