import { UserRole } from "../account/user.interface";
import { IReferenceData, IReferenceDataItem, IReferencePageComponent } from "../reference/page.interface";

export interface IHouseNotification {
    id?: number;
    houseId: number;
    title: string;
    type: HouseNotificationType;
    createdAt: Date;
    text: string;
}

export interface IServiceNotification {
    id?: number;
    userId: number;
    userRole: UserRole;
    title: string;
    description?: string;
    text: string;
    type: ServiceNotificationType;
    createdAt: Date;
    readAt?: Date;
    status: NotificationStatus;
}

export enum NotificationStatus {
    Read = 'Read',
    Unread = 'Unread',
}

export enum HouseNotificationType {
    Accident = 'Авария',
    EngineeringWorks = 'Технические работы',
    Other = 'Другое'
}

export enum ServiceNotificationType {
    Appeal = 'Appeal',
    HouseNotification = 'HouseNotification',
    Meter = 'Meter'
}

export interface IHouseNotificationReferenceData extends IReferenceData {
    notifications: IHouseNotificationReferenceDataItem[];
}

export interface IHouseNotificationReferenceDataItem extends IReferenceDataItem {
    id: number;
    title: string;
    text: string;
    type: HouseNotificationType;
    createdAt: Date;
    name: string;
}

export const notificationPageComponent: IReferencePageComponent<IHouseNotificationReferenceDataItem> = {
    engName: "notification",
    rusName: [{ word: "уведомление", isChangeable: true, replace: ["о"] }],
    gender: "средний",
    keyElements: {
        first: [2], second: 1, tags: [3, 4],
        isSecondNoNeedTitle: true
    },
    components: [
        {
            type: "select", selectorOptions: [],
            title: [{ word: "дом", isChangeable: true }], numberInOrder: 3, id: "name", sendId: "houseId", gender: "мужской",
            rows: []
        },
        {
            type: "select", selectorOptions: [],
            title: [{ word: "тип" }],
            numberInOrder: 2, id: "type", sendId: "type", enum: HouseNotificationType, gender: "мужской",
            rows: []
        },
        {
            type: "input",
            title: [{ word: "тема", isChangeable: true }],
            numberInOrder: 1, id: "title", gender: "женский",
            rows: []
        },
        {
            type: "textarea",
            title: [{ word: "подробности" }],
            numberInOrder: 5, id: "text", gender: "женский",
            rows: []
        },
        {
            type: "none",
            title: [{ word: "дата" }, { word: "создания" }],
            numberInOrder: 4, id: "createdAt", gender: "женский",
            rows: []
        },
    ]
};