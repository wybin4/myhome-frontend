import { IAppeal } from "./event/appeal.interface";
import { IHouseNotification } from "./event/notification.interface";
import { IOption, IVoting } from "./event/voting.interface";

export enum EventType {
    Appeal = "Appeal",
    Notification = "Notification",
    Voting = "Voting"
}

export interface IGetEvents {
    notifications?: IGetHouseNotification[];
    votings?: IGetVoting[];
    appeals?: IGetAppeal[];
}

export interface IGetHouseNotification extends IHouseNotification {
    id: number;
    name: string;
}

export interface IGetAppeal extends IAppeal {
    id: number;
    name: string;
    address?: string;
    personalAccount?: string;
}

export interface IGetVoting extends IVoting {
    id: number;
    result?: string;
    options?: IOption[];
    name: string;
}