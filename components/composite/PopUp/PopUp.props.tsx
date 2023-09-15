import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

export interface PopUpProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    type: "success" | "failure";
    children: ReactNode;
}