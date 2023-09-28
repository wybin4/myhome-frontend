import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

export interface IconProps extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    size: "l" | "m" | "s";
    appearance?: "primary" | "red" | "green" | "none";
    type: "letter" | "icon" | "iconRounded";
    children: ReactNode;
}