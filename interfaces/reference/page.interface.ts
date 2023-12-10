/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITableFilterItem } from "@/components/composite/TableFilter/TableFilter.props";
import { ActionProps } from "@/components/composite/TableRow/Action/Action.props";
import { RowKeyElements } from "@/components/composite/TableRow/TableRow.props";
import { SelectorOption } from "@/components/primitive/Select/Select.props";
import { FieldValues, Path } from "react-hook-form";
import { Gender } from "russian-nouns-js/src/Gender";

export interface IReferenceDataItem {
    id: number | string;
    [key: string]: number | string | Date | undefined;
}

export interface IReferenceData {
    [key: string]: IReferenceDataItem[];
}

export interface IReferencePageComponent<T extends FieldValues> {
    rusName: IReferenceTitle[];
    engName: string;
    gender: Gender[keyof Gender];
    components: IReferencePageItem<T>[];
    tableActions?: ActionProps;
    keyElements?: RowKeyElements;
}

export interface IReferencePageItem<T extends FieldValues> {
    id: Path<T>;
    sendId?: Path<T>;
    enum?: any;

    title: IReferenceTitle[];
    gender: Gender[keyof Gender];

    numberInOrder: number;

    rows: string[];

    isFilter?: boolean;
    filterItems?: { name?: IReferenceTitle[]; items: ITableFilterItem[] }[];

    type: "input" | "select" | "datepicker" | "input-vote" | "none" | "textarea";
    inputType?: "number" | "string";
    selectorType?: "little" | "ordinary" | "withoutradio";

    selectorOptions?: SelectorOption[];
    isInvisibleInTable?: boolean;
}

export interface IReferenceTitle {
    word: string;
    isChangeable?: boolean;
    replace?: string[];
}