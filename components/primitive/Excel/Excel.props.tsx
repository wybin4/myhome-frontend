/* eslint-disable @typescript-eslint/no-explicit-any */
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { FileType } from "../Attachment/Attachment.props";
import { SelectorOption } from "../Select/Select.props";

export interface ExcelProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    text: string;
    fileFormat: FileType[];

    matchHeaders: ExcelHeader[];
    selectors?: ExcelSelector[];

    table: Record<string, any>[];
    setTable: React.Dispatch<React.SetStateAction<Record<string, any>[]>>;

    clear: boolean;
    setClear: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ExcelHeader {
    name: string;
    value: string;
}

export interface ExcelSelector {
    id: string;
    values: SelectorOption[];
}