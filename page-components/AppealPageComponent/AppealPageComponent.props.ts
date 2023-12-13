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
}

export interface AppealDetailPageComponentProps extends Omit<AppealPageComponentProps, "user"> {
    selectedId: number;
    setSelectedId: Dispatch<SetStateAction<number>>;

    isInfoWindowOpen: boolean;
    setIsInfoWindowOpen: Dispatch<SetStateAction<boolean>>;

    setError: Dispatch<SetStateAction<string>>;

    handleFilter: (value: string[], id: string) => Promise<void>;
    isData: boolean;
}