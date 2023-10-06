/* eslint-disable @typescript-eslint/no-explicit-any */
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface TableRowProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    startIcon?: any;
    actions: ITypeOfAction[];
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
    actions: ITypeOfAction[];
    items?: ITableRowItem[];
    keyElements: RowKeyElements;
}

export interface TableRowItemDesktopProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    type: "tag" | "text" | "attachment";
    items?: (string | undefined)[];
}

export interface ITableRowItem {
    title: string;
    type: "tag" | "text" | "attachment" | "none";
    item?: string;
}

export interface ITableRowArr {
    title: string;
    type: "tag" | "text" | "attachment";
    items: string[];
}

export interface ActionProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    actions: ITypeOfAction[];
}

export interface TableAttachmentProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    text?: string;
}

export interface TableTextProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    text?: string;
}

export interface TableTagProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    text?: string;
}

export type ITypeOfAction = "editAndSave" | "delete" | "addComment" | "download";