import { UserRoleType } from "./account/user.interface";

export interface IMenu {
    role: UserRoleType;
    items: IMenuItem[];
}
export interface IMenuItem {
    name: string;
    route: string;
    number: number;
}