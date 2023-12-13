import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction } from "react";

export interface TableSearchProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    id: string;
    handleSearch: (value: string, id: string) => Promise<void>;
}

export interface SearchProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    size: "l" | "m" | "s";
    placeholder?: string;
    value: string | number | undefined;
    setValue: Dispatch<SetStateAction<string | number | undefined>>;
}