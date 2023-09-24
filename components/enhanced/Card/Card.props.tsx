/* eslint-disable @typescript-eslint/no-explicit-any */

import { DetailedHTMLProps, Dispatch, HTMLAttributes, ReactNode, SetStateAction } from "react";

export interface CardTitleProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    text: string;
    iconLeft?: any;
    tag?: string;
    symbolRight?: any;
}

export interface CardInputProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    value?: string;
    setValue?: Dispatch<SetStateAction<string | undefined>>;
    placeholder?: string;
    textAlign?: "left" | "center";
    readOnly?: boolean;
}

export interface CardBottomProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    text?: ReactNode;
    textAlign?: "left" | "center";
    tag?: string;
    attachment?: string;
}

export interface CardProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    titlePart: CardTitleProps;
    description?: string;
    text?: string;
    input?: CardInputProps;
    bottom?: CardBottomProps;
}