/* eslint-disable @typescript-eslint/no-explicit-any */

import { VotingProps } from "@/components/primitive/Voting/Voting.props";
import { DetailedHTMLProps, Dispatch, HTMLAttributes, ReactNode, SetStateAction } from "react";

export interface BaseCardTitleProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    text: string;
    description?: string;
    tag?: {
        tag: string;
        tagIcon: any;
        swap?: boolean;
        onSwapClick?: () => void;
    };
}

export interface CardTitleProps extends BaseCardTitleProps {
    iconLeft?: any;
    iconLeftSize?: "s" | "l";
    iconLeftVisible?: boolean;
    symbolRight?: {
        symbol: any;
        size: "s" | "l";
        onClick?: () => void;
    };
}

export interface ChargeCardTitleProps extends BaseCardTitleProps {
    textRight: string;
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

export interface ChargeCardBottomProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    button?: {
        name: string;
        onClick: () => void;
    };
    text?: ReactNode;
}

export interface BaseCardProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    maxWidth?: string;
    bottom?: CardBottomProps;
}

export interface CardProps extends BaseCardProps {
    titlePart: CardTitleProps;
    description?: string;
    text?: string;
    isMobileText?: boolean;
    input?: CardInputProps;
    voting?: VotingProps;
}

export interface ChargeCardProps extends BaseCardProps {
    titlePart: ChargeCardTitleProps;
    text?: ReactNode;
    bottom: ChargeCardBottomProps;
    onClick: () => void;
}