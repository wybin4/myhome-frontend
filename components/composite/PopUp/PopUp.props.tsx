import { DetailedHTMLProps, Dispatch, HTMLAttributes, MutableRefObject, ReactNode, SetStateAction } from "react";

export interface PopUpProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    type: "success" | "failure" | "link-failure";
    link?: string;
    children: ReactNode;

    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;

    popupRef?: MutableRefObject<null>;
}

export interface CopyProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    link: string;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}