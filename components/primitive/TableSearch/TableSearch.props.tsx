import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction } from "react";

export interface TableSearchProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    size: "l" | "m" | "s";
    placeholder?: string;
    value: string | number | undefined;
    setValue: Dispatch<SetStateAction<string | number | undefined>>;
}