import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface SelectProps extends DetailedHTMLProps<HTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
    id: string;

    selected: SelectorOption | undefined;
    setSelected: React.Dispatch<React.SetStateAction<SelectorOption | undefined>>;

    inputTitle?: string;

    options: SelectorOption[];

    size?: "m" | "s";

    inputError?: string;
}

export interface SelectorOption {
    value: number | string; text: string;
}