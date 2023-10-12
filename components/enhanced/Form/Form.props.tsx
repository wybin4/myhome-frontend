/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectorOption } from "@/components/primitive/Select/Select.props";
import { DetailedHTMLProps, Dispatch, HTMLAttributes, MutableRefObject, ReactNode, SetStateAction } from "react";
import { FieldValues, Path, UseFormReset, UseFormReturn } from "react-hook-form";

export interface BaseFormProps<T extends FieldValues> extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    reset?: UseFormReset<T>

    isOpened: boolean;
    setIsOpened?: (newFormOpened: boolean) => void;

    formRef: React.MutableRefObject<HTMLDivElement | null>;

    children: ReactNode;

    setActiveForm?: () => void;
    
    additionalRef?: MutableRefObject<null>;
}

export interface SelectionFormProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;

    data: {
        dataType: "nested";
        items: {
            title: string;
            icon: any;
            values: SelectionDataItem[];
        }[];
    } | {
        dataType: "flat";
        items: SelectionDataItem[];
    };

    isOpened: boolean;
    setIsOpened?: (newFormOpened: boolean) => void;

    checkedIds?: number[];
    setCheckedIds?: Dispatch<SetStateAction<number[]>>;
}

export interface SerialFormProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    data: {
        dataType: "scroll";
        items: {
            value: string;
            description: string;
        }[];
    } | {
        id: string;
        dataType: "pick";
        inputType?: "string" | "number";
        value: number | string | undefined;

        placeholder?: number | string;

        error: FormError;

        description?: string;
    };

    activeForm: number;
    setActiveForm: Dispatch<SetStateAction<number>>;

    setFormValue?: (value: number | string) => void;

    number: number;

    additionalRef?: MutableRefObject<null>;
}

export interface NestedSelectionFormItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    icon: any;
    values: SelectionDataItem[];
    checkedIds?: number[];
    setCheckedIds?: Dispatch<SetStateAction<number[]>>;
    setPrevCheckedIds?: Dispatch<SetStateAction<number[]>>;
}

export interface SelectionFormCheckboxProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    item: { value: string; id: number };
    checkedIds?: number[];
    setCheckedIds?: Dispatch<SetStateAction<number[]>>;
    setPrevCheckedIds?: Dispatch<SetStateAction<number[]>>;
}

export type SelectionDataItem = {
    value: string;
    id: number;
};

export interface FormProps<T extends FieldValues> extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;

    useFormData: UseFormReturn<T, any, undefined>;

    selectors?: SelectorFormProps<T>[];
    datePickers?: DatePickerFormProps<T>[];
    inputs?: InputFormProps<T>[];

    isOpened: boolean;
    setIsOpened?: (newFormOpened: boolean) => void;

    urlToPost: string;
    additionalFormData?: Record<string | number, any>[];
    successCode: FormSuccess;
    // errorCode?: FormErrors[];
    successMessage: string;
}

export type FormSuccess = 200 | 201;
export type FormErrors = 400 | 404 | 409 | 422 | 500 | 504;

export type FormElementProps<T extends FieldValues> = SelectorFormProps<T> | DatePickerFormProps<T> | InputFormProps<T>;

export interface FormError {
    value: boolean; message?: string;
}

export interface SelectorFormProps<T extends FieldValues> {
    size: "m" | "s";
    inputTitle: string;
    options: SelectorOption[];

    id: Path<T>;
    type: "select";
    numberInOrder: number;
    error: FormError;
}

export interface DatePickerFormProps<T extends FieldValues> {
    inputTitle: string;
    inputSize: "l" | "m" | "s";

    id: Path<T>;
    type: "datepicker";
    numberInOrder: number;
    error: FormError;
}


export interface InputFormProps<T extends FieldValues> {
    title: string;
    size: "l" | "m" | "s";
    inputType?: "number" | "string";

    id: Path<T>;
    type: "input";
    numberInOrder: number;
    error: FormError;
}

