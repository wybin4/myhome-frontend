import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface HistogramProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    data: {
        data: HistogramData[];
        label: string;
    }[];
}

export interface HistogramData {
    date: string;
    total: number;
}