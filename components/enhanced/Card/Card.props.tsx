/* eslint-disable @typescript-eslint/no-explicit-any */

import { VotingProps } from "@/components/primitive/Voting/Voting.props";
import { DetailedHTMLProps, Dispatch, HTMLAttributes, ReactNode, SetStateAction } from "react";

export interface CardTitleProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    text: string;
    description?: string;
    iconLeft?: any;
    iconLeftSize?: "s" | "l";
    tag?: {
        tag: string;
        tagIcon: any;
    }
    symbolRight?: {
        symbol: any;
        size: "s" | "l";
        onClick: () => void;
    };
}

export interface CardInputProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    value?: string | number;
    setValue?: Dispatch<SetStateAction<string | number | undefined>>;
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
    maxWidth?: string;
    text?: string;
    isMobileText?: boolean;
    input?: CardInputProps;
    voting?: VotingProps;
    bottom?: CardBottomProps;
}