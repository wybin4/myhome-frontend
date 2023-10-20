import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction } from "react";

export interface InfoWindowProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    description: string;

    tags?: string[];

    text: string;

    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}