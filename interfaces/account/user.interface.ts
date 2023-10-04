import { IReferenceData, IReferenceDataItem, IReferencePageComponent } from "../reference/page.interface";

export type UserRole = "admin" | "subscriber" | "managementCompany" | "none";

export interface IUser {
    id?: number;
    name?: string;
    email: string;
    passwordHash: string;
    checkingAcount?: string;
}

export interface IUserReferenceData extends IReferenceData {
    subscribers: IUserReferenceDataItem[];
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
    tableActions: [],
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