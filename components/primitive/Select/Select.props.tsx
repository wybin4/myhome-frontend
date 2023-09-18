import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface SelectProps extends DetailedHTMLProps<HTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
    title: string;
    id: string;
    options: { value: string; text: string; }[];
}