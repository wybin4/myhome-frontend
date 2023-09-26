import { SelectorOption } from "@/components/primitive/Select/Select.props";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { UseFormRegister, UseFormHandleSubmit, Control, FieldValues, Path, FormState } from "react-hook-form";

export interface FormProps<T extends FieldValues> extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    useFormData: {
        register: UseFormRegister<T>;
        control: Control<T>;
        handleSubmit: UseFormHandleSubmit<T>;
        formState: FormState<T>
    };
    selectors?: SelectorFormProps<T>[];
    datePickers?: DatePickerFormProps<T>[];
    inputs?: InputFormProps<T>[];
    isOpened: boolean;
    setIsOpened?: (newFormOpened: boolean) => void;
}

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

    id: Path<T>;
    type: "input";
    numberInOrder: number;
    error: FormError;
}

