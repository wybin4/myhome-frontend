import { ButtonHTMLAttributes, DetailedHTMLProps, LegacyRef, ReactNode } from "react";

export interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    appearance: "primary" | "ghost";
    children: ReactNode;
    symbol?: "download" | "upload" | "add" | "filter" | "none";
    size: "l" | "m" | "s";
    typeOfButton?: "ordinary" | "rounded";
    innerRef?: LegacyRef<HTMLButtonElement>;
}