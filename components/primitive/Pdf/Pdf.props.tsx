import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface PdfProps extends DetailedHTMLProps<HTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    pdfUrl: string;
}