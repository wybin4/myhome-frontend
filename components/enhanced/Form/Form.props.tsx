import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

export interface FormProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    children: ReactNode;
    isOpened: boolean;
    setIsOpened?: (newFormOpened: boolean) => void;
}