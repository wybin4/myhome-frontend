import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

export interface TagProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    size: "l" | "m" | "s";
    children: ReactNode;
    appearance?: "primary" | "primary-border" | "red" | "grey" | "green";
}