/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExcelHeader } from "@/components/primitive/Excel/Excel.props";
import { IReferencePageComponent } from "@/interfaces/reference/page.interface";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { FieldValues } from "react-hook-form";

export interface ReferencePageComponentProps<T extends FieldValues> extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    item: IReferencePageComponent<T>;

    uriToAdd: string;
    uriToAddMany?: string;

    additionalSelectorOptions?: { data: Record<string, string | number>[]; id: string }[];

    additionalFormData?: Record<string, string | number>[];
    additionalFileFormData?: Record<string, string | number>;
    headers?: ExcelHeader[];
    setPostData: (newData: any) => void;
}