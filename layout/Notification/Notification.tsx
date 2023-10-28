import { NotificationProps } from "./Notification.props";
import styles from "./Notification.module.css";
import NotificationIcon from "./notification.svg";
import CloseIcon from "../close.svg";
import { useContext, useState } from "react";
import { ServiceNotificationType } from "@/interfaces/event/notification.interface";
import { Icon } from "@/components";
import WarningIcon from "./warning.svg";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import Link from "next/link";
import { AppContext } from "@/context/app.context";

export const Notification = ({ notifications, className, ...props }: NotificationProps): JSX.Element => {
    const [isNotification, setIsNotification] = useState<boolean>(false);
    const { role } = useContext(AppContext);

    const getUrl = (type: ServiceNotificationType) => {
        switch (type) {
            case ServiceNotificationType.Appeal:
                return `/${role}/appeal`;
            case ServiceNotificationType.HouseNotification:
                if (role === "subscriber") {
                    return `/${role}/event`;
                }
                return "#";
            case ServiceNotificationType.Meter:
                if (role === "subscriber") {
                    return `/${role}/meter`;
                } else if (role === "management-company") {
                    return `/${role}/reference/meter`;
                }
                return "#";
            default: return "#";
        }
    };

    return (
        <div className={className} {...props}>
            <span onClick={() => setIsNotification(!isNotification)} className={styles.notificationIcon}><NotificationIcon /></span>
            {isNotification &&
                <>
                    <div className={styles.mobileNotifWrapper}>
                        <div className={styles.mobileText}>Уведомления</div>
                        <span
                            onClick={() => setIsNotification(!isNotification)}
                            className={styles.closeIcon}
                        >
                            <CloseIcon />
                        </span>
                        {notifications?.sort((a, b) => {
                            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                        })
                            .map((notification, key) =>
                                <Link
                                    className={styles.notificationBody}
                                    key={key}
                                    href={getUrl(notification.type)}>
                                    <div className={styles.icon}>
                                        <Icon size="s" type="icon"><WarningIcon /></Icon>
                                    </div>
                                    <div>
                                        <div className={styles.title}>
                                            {notification.title}
                                        </div>
                                        <div className={styles.description}>{notification.description}</div>
                                        <div className={styles.text}>{notification.text}</div>
                                        <div className={styles.createdAt}>
                                            {format(new Date(notification.createdAt), "dd MMMM в HH:mm", {
                                                locale: ru
                                            })}
                                        </div>
                                    </div>
                                </Link>
                            )}
                    </div>
                    <div className={styles.desktopNotifWrapper}>
                        dsfsf
                    </div>
                </>
            }
        </div>
    );
};