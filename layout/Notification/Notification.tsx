import { NotificationProps } from "./Notification.props";
import styles from "./Notification.module.css";
import NotificationIcon from "./notification.svg";
import CloseIcon from "../close.svg";
import { useContext, useEffect, useState } from "react";
import { IServiceNotification, NotificationStatus, ServiceNotificationType } from "@/interfaces/event/notification.interface";
import { Icon } from "@/components";
import WarningIcon from "./warning.svg";
import CheckIcon from "./check.svg";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import Link from "next/link";
import { AppContext } from "@/context/app.context";
import { API, api } from "@/helpers/api";
import cn from "classnames";
import { UserRole } from "@/interfaces/account/user.interface";

export const Notification = ({ user, notifications, className, ...props }: NotificationProps): JSX.Element => {
    const [isNotification, setIsNotification] = useState<boolean>(false);
    const { userRole } = useContext(AppContext);

    useEffect(() => {
        if (isNotification) {
            document.body.style.overflowY = "hidden";
        } else document.body.style.overflowY = "";
    }, [isNotification]);

    const closeNotifications = (e: MouseEvent) => {
        let targetClass;
        const target = e.target as HTMLElement | null;
        if (target) {
            if (!target.classList.contains("viewNotifications")) {
                const parent = target.parentElement;
                if (parent && parent.classList.contains("viewNotifications")) {
                    targetClass = parent.className;
                } else if (parent && parent.parentElement && parent.parentElement.classList.contains("viewNotifications")) {
                    targetClass = parent.parentElement.className;
                }
            } else {
                targetClass = target.className;
            }
        }
        if (
            !(targetClass && targetClass?.split(" ")?.includes("viewNotifications"))
        ) {
            setIsNotification(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", closeNotifications);
        return () => {
            document.removeEventListener("click", closeNotifications);
        };
    }, []);

    const getUrl = (type: ServiceNotificationType) => {
        switch (type) {
            case ServiceNotificationType.Appeal:
                return `/${userRole}/appeal`;
            case ServiceNotificationType.HouseNotification:
                if (userRole === UserRole.Owner) {
                    return `/${userRole}/event`;
                }
                return "#";
            case ServiceNotificationType.Meter:
                if (userRole === UserRole.Owner) {
                    return `/${userRole}/meter`;
                } else if (userRole === UserRole.ManagementCompany) {
                    return `/${userRole}/reference/meter`;
                }
                return "#";
            default: return "#";
        }
    };

    const getNotifications = (notifications: IServiceNotification[]): JSX.Element => {
        if (notifications) {
            const sortedNotifications = notifications.sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            const readNotifications = sortedNotifications.filter(notification => notification.status === NotificationStatus.Read);
            const unReadNotifications = sortedNotifications.filter(notification => notification.status === NotificationStatus.Unread);
            return (
                <>
                    {unReadNotifications.map((notification, key) =>
                        <Link
                            className={cn(styles.notificationBody, "viewNotifications")}
                            key={key}
                            href={getUrl(notification.type)}
                            onClick={async () => {
                                if (notification.status !== NotificationStatus.Read) {
                                    await api.post(API.serviceNotification.read, {
                                        id: notification.id
                                    });
                                }
                            }}
                        >
                            <div className={cn(styles.icon, "viewNotifications")}>
                                <Icon size="s" type="icon" className="viewNotifications"><WarningIcon /></Icon>
                            </div>
                            <div>
                                <div className={cn(styles.title, "viewNotifications")}>
                                    {notification.title}
                                </div>
                                <div className={cn(styles.description, "viewNotifications")}>{notification.description}</div>
                                <div className={cn(styles.text, "viewNotifications")}>{notification.text}</div>
                                <div className={cn(styles.createdAt, "viewNotifications")}>
                                    {format(new Date(notification.createdAt), "dd MMMM в HH:mm", {
                                        locale: ru
                                    })}
                                </div>
                            </div>
                        </Link>
                    )}
                    {readNotifications.length !== 0 && <div className={styles.readNotif}>ПРОЧИТАННЫЕ</div>}
                    {readNotifications.map((notification, key) =>
                        <Link
                            className={cn(styles.notificationBody, "viewNotifications")}
                            key={key}
                            href={getUrl(notification.type)}
                        >
                            <div className={cn(styles.icon, "viewNotifications")}>
                                <Icon size="s" type="icon" className="viewNotifications"><WarningIcon /></Icon>
                            </div>
                            <div>
                                <div className={cn(styles.title, "viewNotifications")}>
                                    {notification.title}
                                </div>
                                <div className={cn(styles.description, "viewNotifications")}>{notification.description}</div>
                                <div className={cn(styles.text, "viewNotifications")}>{notification.text}</div>
                                <div className={cn(styles.createdAt, "viewNotifications")}>
                                    {format(new Date(notification.createdAt), "dd MMMM в HH:mm", {
                                        locale: ru
                                    })}
                                </div>
                            </div>
                        </Link>
                    )}
                </>
            );
        } else return (<></>);
    };

    return (
        <div className={className} {...props} >
            <span
                onClick={() => {
                    setIsNotification(!isNotification);
                }}
                className={cn(styles.notificationIcon, "viewNotifications")}
            ><NotificationIcon /></span>
            {isNotification &&
                <>
                    <div className={cn(styles.notificationWrapper, "viewNotifications")}>
                        <div className={cn(styles.topWrapper, "viewNotifications")}>
                            <div className={cn(styles.mobileText, "viewNotifications")}>Уведомления</div>
                            <span
                                onClick={() => setIsNotification(!isNotification)}
                                className={styles.closeIcon}
                            >
                                <CloseIcon />
                            </span>
                        </div>
                        <div className={cn(styles.notificationsContent, "viewNotifications")}>
                            {getNotifications(notifications)}
                        </div>
                        <div className={cn(styles.buttonWrapper, "viewNotifications")}>
                            <button
                                className={cn(styles.readAll, "viewNotifications")}
                                onClick={async () => {
                                    await api.post(API.serviceNotification.readAll, {
                                        userId: user.userId,
                                        userRole: user.userRole
                                    });
                                }}
                            >
                                <CheckIcon />
                                Прочитать всё
                            </button>
                            <button className={cn(styles.viewAll, "viewNotifications")}>
                                Просмотреть всё
                            </button>
                        </div>
                    </div>
                </>
            }
        </div>
    );
};