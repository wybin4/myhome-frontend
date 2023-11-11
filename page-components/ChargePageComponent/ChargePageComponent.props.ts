import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction } from "react";

export interface ChargePageComponentProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    activeTab: number;
    setActiveTab: Dispatch<SetStateAction<number>>;

    isInfoWindowOpen: boolean;
    setIsInfoWindowOpen: Dispatch<SetStateAction<boolean>>;

    singlePaymentDocuments: ISpdData[];
}

export interface ChargeTextProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    total: string;
    amount: string;
    debt: string;
    date: string;
    downloadUrl: string;
}

export interface ISpdData {
    id: number;
    apartmentName: string;
    fileSize: number;
    pdfBuffer: string;
    createdAt: Date;
}