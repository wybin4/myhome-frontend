import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface ReferenceMenuProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    items: ReferenceMenuItemProps[];
    title: string;
}

export interface ReferenceMenuItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    title: string;
    text: string;
}