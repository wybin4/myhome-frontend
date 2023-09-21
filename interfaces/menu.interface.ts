import { UserRole } from "./account/user.interface";

export interface IMenu {
    role: UserRole;
    items: IMenuItem[];
}
export interface IMenuItem {
    name: string;
    route: string;
    number: number;
}