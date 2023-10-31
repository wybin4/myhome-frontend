import { UserRole } from "@/interfaces/account/user.interface";
import { IServiceNotification } from "@/interfaces/event/notification.interface";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface NotificationProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    notifications: IServiceNotification[];
    user: { userId: number; userRole: UserRole };
}