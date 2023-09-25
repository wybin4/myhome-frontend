import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface SelectProps extends DetailedHTMLProps<HTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
    inputTitle?: string;
    id: string;
    options: { value: string; text: string; }[];
    size?: "m" | "s";
}