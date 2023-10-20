import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction } from "react";

export interface TextareaProps extends DetailedHTMLProps<HTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
    title: string;
    placeholder?: string;

    text?: number;
    setText?: Dispatch<SetStateAction<string | undefined>>;

    textareaError?: string;
}