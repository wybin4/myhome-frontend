import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface MenuProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    items: MenuItemProps[];
    title: string;
}

export interface MenuItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    title: string;
    text: string;
    href: string;
}