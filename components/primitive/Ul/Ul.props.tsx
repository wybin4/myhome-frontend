import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface UlProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    li: string[];
    title: string;
}