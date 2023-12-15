/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBaseDateRange } from "@/components/primitive/DatePicker/DatePicker.props";
import { ExcelHeader } from "@/components/primitive/Excel/Excel.props";
import { IReferencePageComponent } from "@/interfaces/reference/page.interface";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { FieldValues } from "react-hook-form";

export interface ReferencePageComponentProps<T extends FieldValues> extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    item: IReferencePageComponent<T>;

    uriToAdd: string;

    additionalSelectorOptions?: { data: Record<string, string | number>[]; id: string }[];

    additionalFormData?: Record<string, string | number>;
    headers?: ExcelHeader[];
    setPostData: (newData: any) => void;
    entityName?: string;
    addMany?: boolean;

    downloadAllData?: (headers: ExcelHeader[]) => Promise<void>;
    handleFilter: (value: string[], id: string) => Promise<void>;
    handleFilterDate?: (value: IBaseDateRange | undefined, id: string) => Promise<void>;
    handleSearch: (value: string, id: string) => Promise<void>;
    isData: boolean;
}