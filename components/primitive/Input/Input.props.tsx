/* eslint-disable @typescript-eslint/no-explicit-any */
import { DetailedHTMLProps, Dispatch, HTMLAttributes, LegacyRef, SetStateAction } from "react";

export interface InputProps extends DetailedHTMLProps<HTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    title?: string;
    placeholder: string;
    textAlign?: "left" | "center";
    size: "l" | "m" | "s";

    icon?: any;
    sizeOfIcon?: "normal" | "big";
    alignOfIcon?: "left" | "right";

    value?: number | string;
    setValue?: Dispatch<SetStateAction<number | string | undefined>>;
    inputType?: "string" | "number";

    readOnly?: boolean;
    datePicker?: boolean;

    innerRef?: LegacyRef<HTMLInputElement>;

    inputError?: string;
}