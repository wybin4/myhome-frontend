import { IReferenceData, IReferenceDataItem, IReferencePageComponent } from "../reference/page.interface";

export enum UserRole {
    ManagementCompany = 'ManagementCompany',
    Owner = 'Owner',
    Admin = 'Admin',
    None = 'None'
}

export interface IUser {
    id: number;
    name?: string;
    email: string;
    passwordHash: string;
    checkingAcount?: string;
}

export interface ILoginUser {
    email: string;
    password: string;
    userRole: UserRole;
}

export type IGetUser = Omit<IUser, 'passwordHash'>;

export interface IGetUserWithSubscriber {
    user: Omit<IUser, 'passwordHash'>;
    subscribers: {
        id: number;
        address: string;
    }[];
}

export interface IUserReferenceData extends IReferenceData {
    users: IUserReferenceDataItem[];
}

export interface IUserReferenceDataItem extends IReferenceDataItem {
    name?: string;
    email: string;
    passwordHash: string;
    checkingAcount?: string;
}

export const ownerPageComponent:
    IReferencePageComponent<IUserReferenceDataItem> = {
    engName: "owner",
    rusName: [{ word: "собственник", isChangeable: true }],
    gender: "мужской",
    keyElements: { first: [0], second: 1, isSecondNoNeedTitle: true },
    entityName: "user",
    components: [
        {
            type: "input",
            title: [{ word: "ФИО" }], numberInOrder: 1, id: "name", gender: "мужской",
            rows: []
        },
        {
            type: "input",
            title: [{ word: "email" }], numberInOrder: 2, id: "email", gender: "мужской",
            rows: []
        }
    ]
};

export const managementCompanyPageComponent:
    IReferencePageComponent<IUserReferenceDataItem> = {
    engName: "managementCompany",
    rusName: [{ word: "управляюшая", isChangeable: true, replace: ["ш", "щ"] }, { word: "компания", isChangeable: true }],
    gender: "женский",
    keyElements: { first: [0], second: 1, isSecondNoNeedTitle: true },
    entityName: "user",
    components: [
        {
            type: "input",
            title: [{ word: "название" }], numberInOrder: 1, id: "name", gender: "средний",
            rows: []
        },
        {
            type: "input",
            title: [{ word: "email" }], numberInOrder: 2, id: "email", gender: "мужской",
            rows: []
        },
        {
            type: "input",
            title: [{ word: "расчётный" }, { word: "счёт" }], numberInOrder: 3, id: "checkingAccount", gender: "мужской",
            rows: []
        },
    ]
};