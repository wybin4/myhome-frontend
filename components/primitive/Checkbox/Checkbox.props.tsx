import { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from "react";

export interface CheckboxProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    forString: string;
    onClick: () => void;

    children: ReactNode;
}