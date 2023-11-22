import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface PdfProps extends DetailedHTMLProps<HTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    pdfUrl: IPdfUrl;
    print: () => void;
    back?: () => void;
}

export interface IPdfUrl {
    url: string; date: Date; id: number
}
