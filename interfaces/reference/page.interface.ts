import { ITypeOfAction } from "@/components/composite/TableRow/TableRow.props";
import { SelectorOption } from "@/components/primitive/Select/Select.props";
import { FieldValues, Path } from "react-hook-form";
import { Gender } from "russian-nouns-js/src/Gender";

export interface IReferencePageComponent<T extends FieldValues> {
    rusName: IReferenceTitle[];
    engName: string;
    gender: Gender[keyof Gender];
    components: IReferencePageItem<T>[];
    tableActions?: ITypeOfAction[];
}

export interface IReferencePageItem<T extends FieldValues> {
    id: Path<T>;
    title: IReferenceTitle[];
    gender: Gender[keyof Gender];

    numberInOrder: number;

    isFilter?: boolean;
    filterItems?: { name?: IReferenceTitle[]; items: string[] }[];

    type: "input" | "select" | "datepicker" | "none";
    inputType?: "number" | "string"

    selectorOptions?: SelectorOption[];
}

export interface IReferenceTitle {
    word: string;
    isChangeable?: boolean;
}