import { UserRole } from "@/interfaces/account/user.interface";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface NavigationProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    user: { userId: number; userRole: UserRole };
}