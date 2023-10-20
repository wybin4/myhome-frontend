/* eslint-disable @typescript-eslint/no-explicit-any */
import { DetailedHTMLProps, Dispatch, HTMLAttributes, MouseEventHandler, SetStateAction } from "react";
import { ITypeOfAction } from "../TableRow.props";

export interface ActionProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    actions: {
        id: number;
        type: ITypeOfAction;
        onClick: MouseEventHandler<HTMLDivElement>;
        setSelectedId?: Dispatch<SetStateAction<number>>;
    }[];
    isMobile?: boolean;
}

export interface ViewActionProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    item: any;
    onClick: MouseEventHandler<HTMLDivElement>;
}
