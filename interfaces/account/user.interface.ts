import { IReferencePageComponent } from "../reference/page.interface";

export type UserRole = "admin" | "subscriber" | "managementCompany" | "none";

export interface IUser {
    id?: number;
    name?: string;
    email: string;
    passwordHash: string;
    checkingAcount?: string;
}

export interface IUserPage {
    name?: string;
    email: string;
    passwordHash: string;
    checkingAcount?: string;
}

export const ownerPageComponent:
    IReferencePageComponent<IUserPage> = {
    engName: "owner",
    rusName: [{ word: "собственник", isChangeable: true }],
    gender: "мужской",
    tableActions: [],
    components: [
        {
            type: "input",
            title: [{ word: "ФИО" }], numberInOrder: 1, id: "name", gender: "мужской"
        },
        {
            type: "input",
            title: [{ word: "email" }], numberInOrder: 2, id: "email", gender: "мужской"
        }
    ]
};