/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileType } from "@/components/primitive/Attachment/Attachment.props";
import { ExcelHeader, ExcelSelector } from "@/components/primitive/Excel/Excel.props";
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

export interface CardFormProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;

    items: {
        value: string;
        key: string;
        icon: any;
    }[];

    isOpened: boolean;
    setIsOpened?: (newFormOpened: boolean) => void;

    selected: string;
    setSelected: (selected: string) => void;

    next: () => void;
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

export interface FileFormProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;

    isOpened: boolean;
    setIsOpened?: (newFormOpened: boolean) => void;

    headers: ExcelHeader[];
    selectors?: ExcelSelector[];

    urlToPost: string;
    successCode: FormSuccess;
    setPostData?: (newData: any) => void;
    successMessage: string;
    entityName: string;
    additionalFormData?: Record<string | number, any>;
}

export interface InfoFormProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    text: string;
    icon?: "success" | "failure";

    buttons: {
        name: string;
        onClick: () => void;
    }[];

    number: number;
    activeForm: number;
    setActiveForm: Dispatch<SetStateAction<number>>;
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
    inputVotes?: InputVoteFormProps<T>[];
    textAreas?: TextAreaFormProps<T>[];
    attachments?: AttachmentFormProps<T>[];

    isOpened: boolean;
    setIsOpened?: (newFormOpened: boolean) => void;

    urlToPost: string;
    additionalFormData?: Record<string | number, any>;
    successCode: FormSuccess;
    // errorCode?: FormErrors[];
    successMessage: string;

    oneRow?: boolean;

    dataList?: string[];

    setPostData?: (newData: any) => void;
    entityName?: string;

    buttonsText?: {
        add: string;
        cancell: string;
    };
}

export type FormSuccess = 200 | 201;
export type FormErrors = 400 | 404 | 409 | 422 | 500 | 504;

export type FormElementProps<T extends FieldValues> = SelectorFormProps<T> | DatePickerFormProps<T> | InputFormProps<T> | InputVoteFormProps<T> | TextAreaFormProps<T> | AttachmentFormProps<T>;

export interface FormError {
    value: boolean; message?: string;
}

export interface SelectorFormProps<T extends FieldValues> {
    title: string;
    options: SelectorOption[];

    id: Path<T>;
    type: "select";
    numberInOrder: number;
    error: FormError;

    handleSelect?: (option: string | number) => void;

    selectorType?: "little" | "ordinary";
    canIOpenFlag?: {
        flag: boolean,
        error: string;
    };
}

export interface DatePickerFormProps<T extends FieldValues> {
    title: string;

    id: Path<T>;
    type: "datepicker";
    numberInOrder: number;
    error: FormError;
}

export interface InputFormProps<T extends FieldValues> {
    title: string;
    inputType?: "number" | "string";

    id: Path<T>;
    type: "input";
    numberInOrder: number;
    error: FormError;
}

export interface InputVoteFormProps<T extends FieldValues> {
    title: string;

    id: Path<T>;
    type: "input-vote";
    numberInOrder: number;
    error: FormError;
}

export interface TextAreaFormProps<T extends FieldValues> {
    title: string;

    id: Path<T>;
    type: "textarea";
    numberInOrder: number;
    error: FormError;
}

export interface AttachmentFormProps<T extends FieldValues> {
    text: string;
    fileFormat: FileType[];

    id: Path<T>;
    type: "attachment";
    numberInOrder: number;
    error: FormError;
}