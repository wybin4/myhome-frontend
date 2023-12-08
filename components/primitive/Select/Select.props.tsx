import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface SelectProps extends DetailedHTMLProps<HTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
    id: string;

    selected: SelectorOption | undefined;
    setSelected: React.Dispatch<React.SetStateAction<SelectorOption | undefined>>;

    handleSelect?: (option: string | number) => void;

    title?: string;

    options: SelectorOption[];

    size?: "m" | "s";

    inputError?: string;
    setInputError?: (newInputError: string) => void;

    canIOpen?: {
        foo: () => void,
        flag: boolean;
    };
}

export interface LittleSelectProps extends DetailedHTMLProps<HTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
    selected: SelectorOption | undefined;
    setSelected: React.Dispatch<React.SetStateAction<SelectorOption | undefined>>;

    title?: string;

    options: SelectorOption[];

    inputError?: string;
}

export interface SelectorOption {
    value: number | string; text: string;
}

export interface LittleRadioProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    option: SelectorOption;
    checked: boolean;
    onClick: () => void;
}