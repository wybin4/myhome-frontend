import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface TableSearchProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    size: "l" | "s";
}