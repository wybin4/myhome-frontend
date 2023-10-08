import { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from "react";

export interface RadioProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    forString: string;

    checked: boolean;
    onClick: () => void;

    children: ReactNode;
}