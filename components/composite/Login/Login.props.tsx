/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserRole } from "@/interfaces/account/user.interface";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface LoginProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {

}

export interface LoginItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    picture: any;
    title: string;
    handelClick: (role: UserRole) => void;
    role: UserRole;
}