/* eslint-disable @typescript-eslint/no-explicit-any */

import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

export interface CardTitleProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    text: string;
    iconLeft?: any;
    tag?: string;
    symbolRight?: any;
}

export interface CardInputProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    placeholder?: string;
    textAlign?: "left" | "center";
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