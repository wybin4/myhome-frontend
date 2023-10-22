/* eslint-disable @typescript-eslint/no-explicit-any */
import { DetailedHTMLProps, Dispatch, HTMLAttributes, ReactNode, SetStateAction } from "react";

export interface InfoWindowProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    description: string;

    icon?: any;
    tags?: string[];
    buttons?: {
        name: string;
        onClick: () => void;
    }[];

    text: ReactNode;

    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}