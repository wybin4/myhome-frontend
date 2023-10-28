import { IServiceNotification } from "@/interfaces/event/notification.interface";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface NotificationProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    notifications: IServiceNotification[];
}