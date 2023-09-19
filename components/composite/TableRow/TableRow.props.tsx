/* eslint-disable @typescript-eslint/no-explicit-any */
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface TableRowProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    startIcon?: any;
    actions: ITypeOfAction[];
    items: TableRowItemProps[];
}

export interface TableRowItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    type: "tag" | "text" | "attachment";
    items?: (string | undefined)[];
}

export interface ActionProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    actions: ITypeOfAction[];
}

export type ITypeOfAction = "editAndSave" | "delete" | "addComment" | "download";