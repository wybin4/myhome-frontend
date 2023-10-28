import { UserRole } from "./account/user.interface";

export interface IChat {
    _id?: string;
    createdAt: Date;
    users: IChatUser[];
    messages?: IMessage[];
}

export interface IMessage {
    _id?: string;
    sender: IChatUser;
    text: string;
    createdAt: Date;
    readAt?: Date;
    status: MessageStatus;
}

export interface IChatUser {
    userId: number;
    userRole: UserRole;
    name: string;
}

export interface IGetChat extends IChat {
    receiver: IChatUser;
}

export interface IGetMessage extends IMessage {
    receiver: IChatUser;
}

export enum MessageStatus {
    Read = 'Read',
    Unread = 'Unread'
}