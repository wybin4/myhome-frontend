import { DetailedHTMLProps, Dispatch, HTMLAttributes, MouseEventHandler, SetStateAction } from "react";

export interface ChargePageComponentProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    activeTab: number;
    setActiveTab: Dispatch<SetStateAction<number>>;

    isInfoWindowOpen: boolean;
    setIsInfoWindowOpen: Dispatch<SetStateAction<boolean>>;

    singlePaymentDocuments: ISpdData[];
    debts: IGetDebt[];
}

export interface ChargeTextProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    total: string;
    amount: string;
    payed: string;
    date: string;
    onClick: MouseEventHandler<HTMLDivElement>;
}

export interface ISpdData {
    id: number;
    apartmentName: string;
    mcCheckingAccount: string;
    mcName: string;
    fileSize: number;
    pdfBuffer: string;
    createdAt: Date;
}

export interface IGetDebt {
    singlePaymentDocumentId: number;
    originalDebt: number;
    outstandingDebt: number;
}