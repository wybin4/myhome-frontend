import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface InputProps extends DetailedHTMLProps<HTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    value?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon?: any;
    placeholder: string;
    size: "l" | "s";
    sizeOfIcon?: "normal" | "big";
    readOnly?: boolean;
}