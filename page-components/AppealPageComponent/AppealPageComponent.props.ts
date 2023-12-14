/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBaseDateRange } from "@/components/primitive/DatePicker/DatePicker.props";
import { IGetUserWithSubscriber, UserRole } from "@/interfaces/account/user.interface";
import { IGetAppeal } from "@/interfaces/event.interface";
import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction } from "react";

export interface AppealPageComponentProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    user: {
        userId: number;
        userRole: UserRole;
    };

    appeals: IGetAppeal[];
    users?: IGetUserWithSubscriber[];

    handleFilter: (value: string[], id: string) => Promise<void>;
    isData: boolean;

    endOffset?: number;
    totalCount?: number;
    setItemOffset?: Dispatch<SetStateAction<number>>;
    itemOffset?: number;
    handlePaginate?: (selected: number) => Promise<void>;
    handleFilterDate?: (value: IBaseDateRange | undefined, id: string) => Promise<void>;
}

export interface AppealDetailPageComponentProps extends Omit<AppealPageComponentProps, "user"> {
    selectedId: number;
    setSelectedId: Dispatch<SetStateAction<number>>;

    isInfoWindowOpen: boolean;
    setIsInfoWindowOpen: Dispatch<SetStateAction<boolean>>;

    setError: Dispatch<SetStateAction<string>>;

    handleFilter: (value: string[], id: string) => Promise<void>;
    isData: boolean;

    endOffset?: number;
    totalCount?: number;
    setItemOffset?: Dispatch<SetStateAction<number>>;
    itemOffset?: number;
    handlePaginate?: (selected: number) => Promise<void>;
    handleFilterDate?: (value: IBaseDateRange | undefined, id: string) => Promise<void>;
}