/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserRole } from "@/interfaces/account/user.interface";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface MainProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    userRole: UserRole;
}

export interface PossibilityMenuProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    items: { name: string; description?: string; icon: any; stroke?: boolean; }[];
}