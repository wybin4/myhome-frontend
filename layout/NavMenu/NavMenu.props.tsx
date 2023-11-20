import { UserRole } from "@/interfaces/account/user.interface";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface NavMenuProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    user: { userId: number; userRole: UserRole };
}