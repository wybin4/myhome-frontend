import { DetailedHTMLProps, HTMLAttributes, LegacyRef } from "react";

export interface InputProps extends DetailedHTMLProps<HTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    value?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon?: any;
    placeholder: string;
    size: "l" | "m" | "s";
    sizeOfIcon?: "normal" | "big";
    readOnly?: boolean;
    innerRef?: LegacyRef<HTMLInputElement>;
}