import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

export interface IconProps extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    size: "l" | "m" | "s" | "xs";
    appearance?: "primary" | "red" | "green" | "none";
    type: "letter" | "icon" | "iconRounded";
    fillType?: "fill" | "stroke";
    children: ReactNode;
}