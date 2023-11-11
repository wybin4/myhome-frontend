/* eslint-disable @typescript-eslint/no-explicit-any */
import { IReferencePageComponent } from "@/interfaces/reference/page.interface";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { FieldValues } from "react-hook-form";

export interface ReferencePageComponentProps<T extends FieldValues> extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    item: IReferencePageComponent<T>;

    uriToAdd: string;
    uriToAddMany?: string;

    additionalFormData?: Record<string | number, any>[];
    setPostData: (newData: any) => void;
}