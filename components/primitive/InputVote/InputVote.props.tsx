import { DetailedHTMLProps, Dispatch, HTMLAttributes, LegacyRef, SetStateAction } from "react";

export interface InputVoteProps extends DetailedHTMLProps<HTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    title: string;

    value: string[];
    setValue?: Dispatch<SetStateAction<string[]>>;

    innerRef?: LegacyRef<HTMLInputElement>;

    inputError?: string;
}