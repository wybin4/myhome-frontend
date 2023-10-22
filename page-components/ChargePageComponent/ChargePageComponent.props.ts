import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction } from "react";

export interface ChargePageComponentProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    activeTab: number;
    setActiveTab: Dispatch<SetStateAction<number>>;

    isInfoWindowOpen: boolean;
    setIsInfoWindowOpen: Dispatch<SetStateAction<boolean>>;
}

export interface ChargeTextProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    total: string;
    amount: string;
    debt: string;
    date: string;
    downloadUrl: string;
}