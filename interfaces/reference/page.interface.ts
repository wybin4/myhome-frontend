import { ITypeOfAction, RowKeyElements } from "@/components/composite/TableRow/TableRow.props";
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
    tableActions?: ITypeOfAction[];
    keyElements?: RowKeyElements;
}

export interface IReferencePageItem<T extends FieldValues> {
    id: Path<T>;
    title: IReferenceTitle[];
    gender: Gender[keyof Gender];

    numberInOrder: number;

    rows: string[];

    isFilter?: boolean;
    filterItems?: { name?: IReferenceTitle[]; items: string[] }[];

    type: "input" | "select" | "datepicker" | "none";
    inputType?: "number" | "string";

    selectorOptions?: SelectorOption[];
}

export interface IReferenceTitle {
    word: string;
    isChangeable?: boolean;
}