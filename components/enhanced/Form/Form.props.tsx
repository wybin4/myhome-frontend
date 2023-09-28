import { SelectorOption } from "@/components/primitive/Select/Select.props";
import { IMCAddHouseForm } from "@/interfaces/reference/subscriber/house.interface";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { UseFormHandleSubmit, Control, FieldValues, Path, FormState, UseFormReset } from "react-hook-form";

export interface FormProps<T extends FieldValues> extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;

    useFormData: {
        control: Control<T>;
        handleSubmit: UseFormHandleSubmit<T>;
        formState: FormState<T>;
        reset: UseFormReset<IMCAddHouseForm>;
    };

    selectors?: SelectorFormProps<T>[];
    datePickers?: DatePickerFormProps<T>[];
    inputs?: InputFormProps<T>[];

    isOpened: boolean;
    setIsOpened?: (newFormOpened: boolean) => void;

    urlToPost: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

